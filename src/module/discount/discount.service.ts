import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, ILike } from 'typeorm';
import { Discount } from './entities/discount.entity';
import {
  DiscountDto,
  GetDiscountDto,
  UpdateDiscountDto,
} from './dto/request-discount.dto';
import { PageUtil } from '@common/page.util';
import { Page } from '@common/model/page';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
  ) {}

  async create(discountDto: DiscountDto, outletId: string): Promise<Discount> {
    // Trim name and description
    const trimmedName = discountDto.name?.trim();
    const trimmedDescription = discountDto.description?.trim();

    if (!trimmedName) {
      throw new BadRequestException('Name cannot be null');
    }

    // Check for existing discount with same name in outlet
    const existingDiscount = await this.discountRepository.findOne({
      where: {
        name: trimmedName,
        outletId: outletId,
      },
    });

    if (existingDiscount) {
      throw new BadRequestException(
        `Discount with name ${trimmedName} already exists`,
      );
    }

    // Validate percentage value
    if (discountDto.discountType === 'percentage' && discountDto.value > 100) {
      throw new BadRequestException('Percentage discount cannot exceed 100%');
    }

    // Validate date range
    if (discountDto.startAt && discountDto.endAt) {
      const startDate = new Date(discountDto.startAt);
      const endDate = new Date(discountDto.endAt);

      if (startDate >= endDate) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    const discount = this.discountRepository.create({
      ...discountDto,
      name: trimmedName,
      description: trimmedDescription,
      outletId: outletId,
      startAt: discountDto.startAt ? new Date(discountDto.startAt) : null,
      endAt: discountDto.endAt ? new Date(discountDto.endAt) : null,
    });

    return await this.discountRepository.save(discount);
  }

  async findAll(
    queryDto: GetDiscountDto,
    outletId: string,
  ): Promise<Page<Discount>> {
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

    if (queryDto.discountType) {
      conditions.discountType = queryDto.discountType;
    }

    if (queryDto.isActive !== undefined) {
      conditions.isActive = queryDto.isActive;
    }

    const query: FindManyOptions<Discount> = {
      take: pageUtil.limit,
      skip: pageUtil.skipRecord(),
      where: conditions,
      relations: ['outlet'],
      order: {
        createdAt: 'DESC',
      },
    };

    const [data, total] = await this.discountRepository.findAndCount(query);
    return new Page(data, total, pageUtil);
  }

  async getDropdown(outletId?: string): Promise<Discount[]> {
    const conditions: any = {
      isActive: true,
    };

    if (outletId) {
      conditions.outletId = outletId;
    }

    const discounts = await this.discountRepository.find({
      where: conditions,
      select: ['id', 'name', 'discountType', 'value'],
      relations: ['outlet'],
    });

    return discounts;
  }

  async findOne(id: string): Promise<Discount> {
    const discount = await this.discountRepository.findOne({
      where: { id },
      relations: ['outlet'],
    });

    if (!discount) {
      throw new NotFoundException(`Discount with ID ${id} not found`);
    }

    return discount;
  }

  async update(id: string, updateDto: UpdateDiscountDto): Promise<Discount> {
    const discount = await this.discountRepository.findOne({
      where: { id },
      relations: ['outlet'],
    });

    if (!discount) {
      throw new NotFoundException(`Discount with ID ${id} not found`);
    }

    // Trim name and description if provided
    if (updateDto.name != null) {
      const trimmedName = updateDto.name.trim();
      if (!trimmedName) {
        throw new BadRequestException('Name cannot be empty');
      }

      // Check for duplicate name (excluding current discount)
      const existingDiscount = await this.discountRepository.findOne({
        where: {
          name: trimmedName,
          outletId: discount.outletId,
        },
      });

      if (existingDiscount && existingDiscount.id !== id) {
        throw new BadRequestException(
          `Discount with name ${trimmedName} already exists`,
        );
      }

      discount.name = trimmedName;
    }

    if (updateDto.description != null) {
      discount.description = updateDto.description.trim();
    }

    if (updateDto.discountType != null) {
      discount.discountType = updateDto.discountType;
    }

    if (updateDto.value != null) {
      // Validate percentage value
      if (updateDto.discountType === 'percentage' && updateDto.value > 100) {
        throw new BadRequestException('Percentage discount cannot exceed 100%');
      }
      discount.value = updateDto.value;
    }

    if (updateDto.code != null) {
      discount.code = updateDto.code;
    }

    if (updateDto.appliesTo != null) {
      discount.appliesTo = updateDto.appliesTo;
    }

    if (updateDto.isActive != null) {
      discount.isActive = updateDto.isActive;
    }

    if (updateDto.startAt != null) {
      discount.startAt = new Date(updateDto.startAt);
    }

    if (updateDto.endAt != null) {
      discount.endAt = new Date(updateDto.endAt);
    }

    // Validate date range if both dates are provided
    if (
      discount.startAt &&
      discount.endAt &&
      discount.startAt >= discount.endAt
    ) {
      throw new BadRequestException('End date must be after start date');
    }

    return await this.discountRepository.save(discount);
  }

  async remove(id: string): Promise<void> {
    const discount = await this.discountRepository.findOne({
      where: { id },
    });

    if (!discount) {
      throw new NotFoundException(`Discount with ID ${id} not found`);
    }

    await this.discountRepository.remove(discount);
  }
}
