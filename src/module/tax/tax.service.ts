import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, ILike } from 'typeorm';
import { Tax } from './entities/tax.entity';
import { TaxDto, GetTaxDto, UpdateTaxDto } from './dto/request-tax.dto';
import { PageUtil } from '@common/page.util';
import { Page } from '@common/model/page';

@Injectable()
export class TaxService {
  constructor(
    @InjectRepository(Tax)
    private readonly taxRepository: Repository<Tax>,
  ) {}

  async create(taxDto: TaxDto, outletId: string): Promise<Tax> {
    // Trim name
    const trimmedName = taxDto.name?.trim();

    if (!trimmedName) {
      throw new BadRequestException('Name cannot be null');
    }

    // Check for existing tax with same name in outlet
    const existingTax = await this.taxRepository.findOne({
      where: {
        name: trimmedName,
        outletId: outletId,
      },
    });

    if (existingTax) {
      throw new BadRequestException(
        `Tax with name ${trimmedName} already exists`,
      );
    }

    // Validate amount
    if (taxDto.amount < 0 || taxDto.amount > 100) {
      throw new BadRequestException('Tax amount must be between 0 and 100');
    }

    const tax = this.taxRepository.create({
      ...taxDto,
      name: trimmedName,
      outletId: outletId,
    });

    return await this.taxRepository.save(tax);
  }

  async findAll(queryDto: GetTaxDto, outletId: string): Promise<Page<Tax>> {
    if (!outletId) {
      throw new BadRequestException('Outlet ID is required');
    }

    const { page, limit } = queryDto;
    const pageUtil = new PageUtil(page, limit);

    const conditions: any = {
      outletId: outletId,
    };

    if (queryDto.search) {
      conditions.name = ILike(`%${queryDto.search}%`);
    }

    if (queryDto.name) {
      conditions.name = ILike(`%${queryDto.name}%`);
    }

    if (queryDto.isActive !== undefined) {
      conditions.isActive = queryDto.isActive;
    }

    const query: FindManyOptions<Tax> = {
      take: pageUtil.limit,
      skip: pageUtil.skipRecord(),
      where: conditions,
      relations: ['outlet'],
      order: {
        createdAt: 'DESC',
      },
    };

    const [data, total] = await this.taxRepository.findAndCount(query);
    return new Page(data, total, pageUtil);
  }

  async getDropdown(outletId?: string) {
    const conditions: any = {
      isActive: true,
      outletId: outletId,
    };

    const getTaxes = await this.taxRepository.find({
      where: conditions,
      select: ['id', 'name', 'amount'],
      order: {
        name: 'ASC',
      },
    });

    const taxes = getTaxes.map((tax) => ({
      value: tax.id,
      label: `${tax.name} (${tax.amount}%)`,
    }));

    return taxes;
  }

  async findOne(id: string): Promise<Tax> {
    const tax = await this.taxRepository.findOne({
      where: { id },
      relations: ['outlet'],
    });

    if (!tax) {
      throw new NotFoundException(`Tax with ID ${id} not found`);
    }

    return tax;
  }

  async update(id: string, updateDto: UpdateTaxDto): Promise<Tax> {
    const tax = await this.taxRepository.findOne({
      where: { id },
      relations: ['outlet'],
    });

    if (!tax) {
      throw new NotFoundException(`Tax with ID ${id} not found`);
    }

    // Trim name if provided
    if (updateDto.name != null) {
      const trimmedName = updateDto.name.trim();
      if (!trimmedName) {
        throw new BadRequestException('Name cannot be empty');
      }

      // Check for duplicate name (excluding current tax)
      const existingTax = await this.taxRepository.findOne({
        where: {
          name: trimmedName,
          outletId: tax.outletId,
        },
      });

      if (existingTax && existingTax.id !== id) {
        throw new BadRequestException(
          `Tax with name ${trimmedName} already exists`,
        );
      }

      tax.name = trimmedName;
    }

    if (updateDto.amount != null) {
      // Validate amount
      if (updateDto.amount < 0 || updateDto.amount > 100) {
        throw new BadRequestException('Tax amount must be between 0 and 100');
      }
      tax.amount = updateDto.amount;
    }

    if (updateDto.isActive != null) {
      tax.isActive = updateDto.isActive;
    }

    return await this.taxRepository.save(tax);
  }

  async remove(id: string): Promise<void> {
    const tax = await this.taxRepository.findOne({
      where: { id },
    });

    if (!tax) {
      throw new NotFoundException(`Tax with ID ${id} not found`);
    }

    await this.taxRepository.remove(tax);
  }
}
