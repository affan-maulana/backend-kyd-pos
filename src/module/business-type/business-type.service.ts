import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessType } from '@module/business-type/entities/business-type.entity';
import { FindManyOptions, Repository } from 'typeorm';
import {
  BusinessTypeDto,
  GetBusinessTypeDto,
} from './dto/request-business-type.dto';
import { ResponsePaginationDto } from '@common/dto/response-pagination.dto';

@Injectable()
export class BusinessTypeService {
  constructor(
    @InjectRepository(BusinessType)
    private readonly businessTypeRepository: Repository<BusinessType>,
  ) {}

  /**
   * Create a new business type
   * @param createBusinessTypeDto - Data transfer object for creating a business type
   * @returns The created business type
   */
  async create(businessTypeDto: BusinessTypeDto) {
    try {
      const businessType = this.businessTypeRepository.create(businessTypeDto);
      await this.businessTypeRepository.save(businessType);
      return {
        result: null,
        message: 'Business type created successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find all business types
   * @param currentPage - The current page number
   * @param limit - The number of items per page
   * @param search - The search term
   * @returns A paginated list of business types
   */

  async findAll(
    getDto: GetBusinessTypeDto,
  ): Promise<ResponsePaginationDto<any>> {
    const page = Number(getDto.page) || 1;
    const take = Number(getDto.limit) || 10;
    const skip = (page - 1) * take;
    const query: FindManyOptions<BusinessType> = {
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      skip,
      take,
    };

    const [data, total] = await this.businessTypeRepository.findAndCount(query);
    const result = data.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
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

  /**
   * Find a business type by ID
   * @param id - The ID of the business type
   * @returns The found business type
   */
  async findOne(id: string) {
    const data = await this.businessTypeRepository.findOne({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
      },
    });
    return {
      result: data,
    };
  }

  /**
   * Update a business type by ID
   * @param id - The ID of the business type to update
   * @param updateBusinessTypeDto - Data transfer object for updating a business type
   * @returns The updated business type
   */
  async update(id: string, updateBusinessTypeDto: BusinessTypeDto) {
    try {
      const existingBusinessType = await this.businessTypeRepository.findOne({
        where: { id },
      });
      if (!existingBusinessType) {
        throw new Error('Business type not found');
      }

      await this.businessTypeRepository.update(id, updateBusinessTypeDto);
      const result = await this.businessTypeRepository.findOne({
        where: { id },
      });
      return {
        result: result,
        message: 'Business type updated successfully',
      };
    } catch (error) {
      throw new Error('Error updating business type: ' + error.message);
    }
  }

  /**
   * Remove a business type by ID
   * @param id - The ID of the business type to remove
   * @returns A message indicating the result of the operation
   */
  async remove(id: string) {
    try {
      await this.businessTypeRepository.delete(id);
      return {
        id: id,
        message: 'Business type removed successfully',
      };
    } catch (error) {
      throw new Error('Error removing business type: ' + error.message);
    }
  }

  /**
   * Get dropdown options for business types
   * @returns An array of business types formatted for dropdown selection
   */
  async getDropdown() {
    try {
      const businessTypes = await this.businessTypeRepository.find({
        select: {
          id: true,
          name: true,
        },
      });
      const data = businessTypes.map((item) => ({
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
