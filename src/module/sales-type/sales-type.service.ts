import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SalesType } from './entities/sales-type.entity';
import { ValidationService } from '@helpers/outlet-validation.service';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetSalesTypeDto, SalesTypeDto } from './dto/request-sales-type.dto';
import { ResponsePaginationDto } from '@common/dto/response-pagination.dto';

@Injectable()
export class SalesTypeService {
  constructor(
    @InjectRepository(SalesType)
    private readonly salesTypeRepository: Repository<SalesType>,

    private validationService: ValidationService,
  ) {}
  async create(salesTypeDto: SalesTypeDto, businessId: string) {
    try {
      const validateOutlet = await this.validationService.validateOutlet(
        salesTypeDto.outletId,
        businessId,
      );

      if (!validateOutlet) {
        throw new NotFoundException('Outlet not found');
      }

      const checkDuplicate = await this.salesTypeRepository.findOne({
        where: {
          name: salesTypeDto.name,
          outletId: salesTypeDto.outletId,
        },
      });

      if (checkDuplicate) {
        throw new BadRequestException('Sales Type already exists');
      }

      const salesType = this.salesTypeRepository.create(salesTypeDto);
      const result = await this.salesTypeRepository.save(salesType);
      return {
        result: result,
        message: 'Sales Type created successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    getDto: GetSalesTypeDto,
    businessId: string,
  ): Promise<ResponsePaginationDto<any>> {
    const validateOutlet = await this.validationService.validateOutlet(
      getDto.outletId,
      businessId,
    );

    if (!validateOutlet) {
      throw new NotFoundException('Outlet not found');
    }

    const page = Number(getDto.page) || 1;
    const take = Number(getDto.limit) || 10;
    const skip = (page - 1) * take;
    const conditions = {};

    const query: FindManyOptions<SalesType> = {
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      where: conditions,
      skip,
      take,
      order: {
        createdAt: 'DESC',
      },
    };

    const [data, total] = await this.salesTypeRepository.findAndCount(query);
    const result = data.map((item) => ({
      id: item.id,
      name: item.name,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
    return {
      data: result,
      meta: {
        totalItems: total,
        totalPages: Math.ceil(total / take),
        page: page,
        limit: take,
      },
    };
  }

  async findOne(id: string) {
    const data = await this.salesTypeRepository.findOne({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return {
      result: data,
    };
  }

  async update(id: string, updateSalesTypeDto: SalesTypeDto) {
    try {
      const existingSalesType = await this.salesTypeRepository.findOne({
        where: { id },
      });
      if (!existingSalesType) {
        throw new Error('Sales Type not found');
      }

      const updateData = { ...updateSalesTypeDto, updatedAt: new Date() };
      await this.salesTypeRepository.update(id, updateData);
      const result = await this.salesTypeRepository.findOne({
        where: { id },
      });
      return {
        result: result,
        message: 'Sales Type updated successfully',
      };
    } catch (error) {
      throw new Error('Error updating Sales Type: ' + error.message);
    }
  }

  async remove(id: string) {
    try {
      const existingStaff = await this.salesTypeRepository.findOne({
        where: { id, deletedAt: null },
      });
      if (!existingStaff) throw new Error('Sales Type not found');

      await this.salesTypeRepository.update(id, {
        deletedAt: new Date(),
      });
      return {
        message: 'Sales Type removed successfully',
      };
    } catch (error) {
      throw new Error('Error removing Sales Type: ' + error.message);
    }
  }

  async getDropdown() {
    try {
      const salesType = await this.salesTypeRepository.find({
        select: {
          id: true,
          name: true,
        },
      });
      const data = salesType.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      return {
        result: data,
        message: 'Dropdown options fetched successfully',
      };
    } catch (error) {
      throw new Error('Error fetching dropdown options: ' + error.message);
    }
  }
}
