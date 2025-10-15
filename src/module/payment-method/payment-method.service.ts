import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, ILike } from 'typeorm';
import { PaymentMethod } from '@module/payment-method/entities/payment-method.entity';
import {
  PaymentMethodDto,
  GetPaymentMethodDto,
  UpdatePaymentMethodDto,
} from './dto/request-payment-method.dto';
import { PageUtil } from '@common/page.util';
import { Page } from '@common/model/page';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
  ) {}

  async create(
    paymentMethodDto: PaymentMethodDto,
    outletId: string,
  ): Promise<PaymentMethod> {
    // Trim name and code
    const trimmedName = paymentMethodDto.name?.trim();
    const trimmedCode = paymentMethodDto.code?.trim();
    const trimmedType = paymentMethodDto.type?.trim();

    if (!trimmedName) {
      throw new BadRequestException('Name cannot be null');
    }

    if (!trimmedCode) {
      throw new BadRequestException('Code cannot be null');
    }

    if (!trimmedType) {
      throw new BadRequestException('Type cannot be null');
    }

    // Check for existing payment method with same name in outlet
    const existingByName = await this.paymentMethodRepository.findOne({
      where: {
        name: trimmedName,
        outletId: outletId,
      },
    });

    if (existingByName) {
      throw new BadRequestException(
        `Payment method with name ${trimmedName} already exists`,
      );
    }

    // Check for existing payment method with same code in outlet
    const existingByCode = await this.paymentMethodRepository.findOne({
      where: {
        code: trimmedCode,
        outletId: outletId,
      },
    });

    if (existingByCode) {
      throw new BadRequestException(
        `Payment method with code ${trimmedCode} already exists`,
      );
    }

    // If this is set as default, unset others
    if (paymentMethodDto.isDefault) {
      await this.unsetOtherDefaults(outletId);
    }

    const paymentMethod = this.paymentMethodRepository.create({
      ...paymentMethodDto,
      name: trimmedName,
      code: trimmedCode,
      type: trimmedType,
      outletId: outletId,
    });

    return await this.paymentMethodRepository.save(paymentMethod);
  }

  async findAll(
    queryDto: GetPaymentMethodDto,
    outletId: string,
  ): Promise<Page<PaymentMethod>> {
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

    if (queryDto.type) {
      conditions.type = queryDto.type;
    }

    if (queryDto.isActive !== undefined) {
      conditions.isActive = queryDto.isActive;
    }

    if (queryDto.isDefault !== undefined) {
      conditions.isDefault = queryDto.isDefault;
    }

    const query: FindManyOptions<PaymentMethod> = {
      take: pageUtil.limit,
      skip: pageUtil.skipRecord(),
      where: conditions,
      relations: ['outlet'],
      order: {
        isDefault: 'DESC',
        createdAt: 'DESC',
      },
    };

    const [data, total] =
      await this.paymentMethodRepository.findAndCount(query);
    return new Page(data, total, pageUtil);
  }

  async getDropdown(outletId?: string): Promise<PaymentMethod[]> {
    const conditions: any = {
      isActive: true,
    };

    if (outletId) {
      conditions.outletId = outletId;
    }

    const paymentMethods = await this.paymentMethodRepository.find({
      where: conditions,
      select: ['id', 'name', 'code', 'type', 'feePercent'],
      relations: ['outlet'],
      order: {
        isDefault: 'DESC',
        name: 'ASC',
      },
    });

    return paymentMethods;
  }

  async findOne(id: string): Promise<PaymentMethod> {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id },
      relations: ['outlet'],
    });

    if (!paymentMethod) {
      throw new NotFoundException(`Payment method with ID ${id} not found`);
    }

    return paymentMethod;
  }

  async update(
    id: string,
    updateDto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethod> {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id },
      relations: ['outlet'],
    });

    if (!paymentMethod) {
      throw new NotFoundException(`Payment method with ID ${id} not found`);
    }

    // Trim name if provided
    if (updateDto.name != null) {
      const trimmedName = updateDto.name.trim();
      if (!trimmedName) {
        throw new BadRequestException('Name cannot be empty');
      }

      // Check for duplicate name (excluding current payment method)
      const existingByName = await this.paymentMethodRepository.findOne({
        where: {
          name: trimmedName,
          outletId: paymentMethod.outletId,
        },
      });

      if (existingByName && existingByName.id !== id) {
        throw new BadRequestException(
          `Payment method with name ${trimmedName} already exists`,
        );
      }

      paymentMethod.name = trimmedName;
    }

    // Trim code if provided
    if (updateDto.code != null) {
      const trimmedCode = updateDto.code.trim();
      if (!trimmedCode) {
        throw new BadRequestException('Code cannot be empty');
      }

      // Check for duplicate code (excluding current payment method)
      const existingByCode = await this.paymentMethodRepository.findOne({
        where: {
          code: trimmedCode,
          outletId: paymentMethod.outletId,
        },
      });

      if (existingByCode && existingByCode.id !== id) {
        throw new BadRequestException(
          `Payment method with code ${trimmedCode} already exists`,
        );
      }

      paymentMethod.code = trimmedCode;
    }

    if (updateDto.type != null) {
      paymentMethod.type = updateDto.type.trim();
    }

    if (updateDto.feePercent != null) {
      paymentMethod.feePercent = updateDto.feePercent;
    }

    if (updateDto.isActive != null) {
      paymentMethod.isActive = updateDto.isActive;
    }

    // If setting as default, unset others first
    if (updateDto.isDefault === true && !paymentMethod.isDefault) {
      await this.unsetOtherDefaults(paymentMethod.outletId, id);
    }

    if (updateDto.isDefault != null) {
      paymentMethod.isDefault = updateDto.isDefault;
    }

    return await this.paymentMethodRepository.save(paymentMethod);
  }

  async remove(id: string): Promise<void> {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id },
    });

    if (!paymentMethod) {
      throw new NotFoundException(`Payment method with ID ${id} not found`);
    }

    await this.paymentMethodRepository.remove(paymentMethod);
  }

  private async unsetOtherDefaults(
    outletId: string,
    excludeId?: string,
  ): Promise<void> {
    const queryBuilder = this.paymentMethodRepository
      .createQueryBuilder()
      .update(PaymentMethod)
      .set({ isDefault: false })
      .where('outletId = :outletId', { outletId })
      .andWhere('isDefault = :isDefault', { isDefault: true });

    if (excludeId) {
      queryBuilder.andWhere('id != :excludeId', { excludeId });
    }

    await queryBuilder.execute();
  }
}
