import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, ILike, Repository } from 'typeorm';
import { PageUtil } from '@common/page.util';
import { AddOn } from './entities/add-on.entity';
import { AddOnGroup } from './entities/add-on-group.entity';
import { AddOnQueryDto } from './dto/add-on-query.dto';
import { RequestAddOnGroupDto } from './dto/request-add-on.-group.dto';
import { Page } from '@common/model/page';
import { UpdateAddOnGroupDto } from './dto/update-add-on.-group.dto';
import { OutletService } from '@module/outlet/outlet.service';
import { Outlet } from '@module/outlet/entities/outlet.entity';

@Injectable()
export class AddOnService {
  constructor(
    @InjectRepository(AddOnGroup)
    private readonly addOnGroupRepo: Repository<AddOnGroup>,
    @InjectRepository(AddOn)
    private readonly addOnRepo: Repository<AddOn>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly outletService: OutletService,
  ) {}

  async findAll(queryDto: AddOnQueryDto): Promise<Page<AddOnGroup>> {
    const { page, limit, name } = queryDto;
    const pageUtil = new PageUtil(page, limit);

    const query: FindManyOptions<AddOnGroup> = {
      relations: ['addOns'],
      order: { createdAt: 'DESC' },
    };

    if (name) {
      query.where = { name: ILike(`%${name}%`) };
    }

    const [data, total] = await this.addOnGroupRepo.findAndCount(query);

    return new Page(data, total, pageUtil);
  }

  async findDropdown(): Promise<AddOnGroup[]> {
    return await this.addOnGroupRepo.find({ relations: ['addOns'] });
  }

  async findOne(id: string): Promise<AddOnGroup> {
    const group = await this.addOnGroupRepo.findOne({
      where: { id, deletedAt: null },
      relations: ['addOns'],
    });

    if (!group) {
      throw new NotFoundException(`Add on group with ID ${id} not found`);
    }

    return group;
  }

  async create(dto: RequestAddOnGroupDto): Promise<AddOnGroup> {
    // const outlet = await this.outletService.findOne(dto.outletId);
    // // if (!outlet) throw new NotFoundException('Outlet not found');

    return this.dataSource.transaction(async (manager) => {
      const outlet = await manager.findOne(Outlet, {
        where: { id: dto.outletId },
      });
      if (!outlet) throw new NotFoundException('Outlet not found');

      const group = manager.create(AddOnGroup, {
        name: dto.name,
        isRequired: dto.isRequired ?? false,
        maxSelection: dto.maxSelection ?? 0,
        outlet,
      });
      const saved = await manager.save(group);

      if (dto.addOns?.length) {
        const children = dto.addOns.map((item) =>
          manager.create(AddOn, {
            name: item.name,
            price: item.price ?? 0,
            addOnsGroupId: saved.id,
          }),
        );
        await manager.save(children);
      }

      return manager.findOne(AddOnGroup, {
        where: { id: saved.id },
        relations: ['addOns'],
      });
    });
  }

  async update(id: string, dto: UpdateAddOnGroupDto): Promise<AddOnGroup> {
    return await this.dataSource.transaction(async (manager) => {
      // 1. Cek group
      const group = await manager.findOne(AddOnGroup, {
        where: { id },
        relations: ['addOns'],
      });

      if (!group) {
        throw new NotFoundException(`Add on group with ID ${id} not found`);
      }

      // 2. Update field group
      group.name = dto.name ?? group.name;
      group.isRequired = dto.isRequired ?? group.isRequired;
      group.maxSelection = dto.maxSelection ?? group.maxSelection;
      await manager.save(group);

      // 3. Update AddOns
      if (dto.addOns && dto.addOns.length > 0) {
        const existingAddOns = group.addOns;

        // --- a. Delete addOns that are not in dto.addOns ---
        const dtoIds = dto.addOns.map((a) => a.id).filter(Boolean); // only those with ID
        const toDelete = existingAddOns.filter((e) => !dtoIds.includes(e.id));
        if (toDelete.length > 0) {
          await manager.softRemove(toDelete); // soft delete
        }

        // --- b. Upsert (update if id exists, otherwise create new) ---
        for (const item of dto.addOns) {
          if (item.id) {
            // Update existing
            const addOn = existingAddOns.find((e) => e.id === item.id);
            if (addOn) {
              addOn.name = item.name ?? addOn.name;
              addOn.price = item.price ?? addOn.price;
              await manager.save(addOn);
            }
          } else {
            // New addOn
            const newAddOn = manager.create(AddOn, {
              name: item.name,
              price: item.price ?? 0,
              addOnsGroupId: group.id,
            });
            await manager.save(newAddOn);
          }
        }
      }

      // 4. Return updated group with relations
      return await manager.findOne(AddOnGroup, {
        where: { id: group.id },
        relations: ['addOns'],
      });
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      // Soft delete all add_ons under this group
      await manager.softDelete(AddOn, { addOnsGroupId: id });

      // Soft delete the group itself
      await manager.softDelete(AddOnGroup, { id });
    });
  }
}
