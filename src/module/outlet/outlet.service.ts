import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Outlet } from '@module/outlet/entities/outlet.entity';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { RequestOutletDto } from './dto/request-outlet.dto';
import { PageUtil } from '@common/page.util';
import { OutletQueryDto } from './dto/outlet-query.dto';
import { Page } from '@common/model/page';
import { UpdateOutletDto } from './dto/update-outlet.dto';

@Injectable()
export class OutletService {
  constructor(
    @InjectRepository(Outlet)
    private readonly outletRepository: Repository<Outlet>,
  ) {}

  async create(
    requestOutletDto: RequestOutletDto,
    userId: string,
    businessId: string,
  ): Promise<Outlet> {
    // Add 10 seconds timeout for latency testing
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // Trim name and address
    const trimmedName = requestOutletDto.name?.trim();
    const trimmedAddress = requestOutletDto.address?.trim();

    if (!trimmedName) throw new BadRequestException('Name cannot be null');
    if (!trimmedAddress)
      throw new BadRequestException('Address cannot be null');

    if (!businessId) {
      throw new NotFoundException(`Business not found`);
    }

    const existingOutlet = await this.outletRepository.findOne({
      where: {
        name: trimmedName,
        businessId,
      },
    });
    if (existingOutlet) {
      throw new BadRequestException(
        `Outlet with name ${trimmedName} already exists`,
      );
    }

    const outlet = this.outletRepository.create({
      ...requestOutletDto,
      name: trimmedName,
      address: trimmedAddress,
    });
    outlet.businessId = businessId;
    const result = await this.outletRepository.save(outlet);
    return result;
  }

  async findAll(
    queryDto: OutletQueryDto,
    businessId: string,
  ): Promise<Page<Outlet>> {
    if (!businessId) {
      throw new BadRequestException('Business ID is required');
    }

    const { page, limit } = queryDto;
    const pageUtil = new PageUtil(page, limit);
    const conditions = {
      businessId,
    };

    if (queryDto.search) {
      conditions['name'] = ILike(`%${queryDto.search}%`);
    }

    const query: FindManyOptions<Outlet> = {
      take: pageUtil.limit,
      skip: pageUtil.skipRecord(),
      where: conditions,
      order: {
        createdAt: 'DESC',
      },
    };

    if (queryDto.name) {
      query.where = {
        name: ILike(`%${queryDto.name}%`),
      };
    }
    const [data, total] = await this.outletRepository.findAndCount(query);

    return new Page(data, total, pageUtil);
  }

  async findDropdown(businessId: string): Promise<Outlet[]> {
    if (!businessId) {
      throw new BadRequestException('Business ID is required');
    }

    const outlets = await this.outletRepository.find({
      where: {
        businessId,
        isActive: true,
      },
      select: ['id', 'name'],
    });

    if (outlets.length === 0) {
      throw new NotFoundException('No outlets found for the given business ID');
    }

    return outlets;
  }

  async findOne(id: string): Promise<Outlet> {
    const outlet = await this.outletRepository.findOne({ where: { id } });

    if (!outlet) {
      throw new NotFoundException(`Outlet with ID ${id} not found`);
    }

    return outlet;
  }

  async update(
    id: string,
    updateDto: UpdateOutletDto,
    businessId: string,
  ): Promise<Outlet> {
    const outlet = await this.outletRepository.findOne({
      where: { id, businessId },
    });

    if (!outlet) {
      throw new NotFoundException(`Outlet with ID ${id} not found`);
    }

    // Only update if value is provided and trim the values
    if (updateDto.name != null) {
      const trimmedName = updateDto.name.trim();
      if (!trimmedName) {
        throw new BadRequestException('Name cannot be empty');
      }
      outlet.name = trimmedName;
    }

    if (updateDto.address != null) {
      const trimmedAddress = updateDto.address.trim();
      if (!trimmedAddress) {
        throw new BadRequestException('Address cannot be empty');
      }
      outlet.address = trimmedAddress;
    }

    if (updateDto.isActive != null) outlet.isActive = updateDto.isActive;

    outlet.updatedAt = new Date();
    return await this.outletRepository.save(outlet);
  }

  async remove(id: string): Promise<void> {
    const outlet = await this.outletRepository.findOne({ where: { id } });

    if (!outlet) {
      throw new NotFoundException(`Outlet with ID ${id} not found`);
    }

    await this.outletRepository.softRemove(outlet);
  }
}
