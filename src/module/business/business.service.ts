import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { Business } from '@module/business/entities/business.entity';
import {
  BusinessDto,
  CreateBusinessDto,
  GetBusinessDto,
} from './dto/request-business.dto';
import { ResponsePaginationDto } from '@common/dto/response-pagination.dto';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async create(createBusinessDto: CreateBusinessDto, userId: string) {
    try {
      const newBusiness = this.businessRepository.create({
        ...createBusinessDto,
        userId: userId,
      });
      const data = await this.businessRepository.save(newBusiness);
      return {
        result: data,
        message: 'Business created successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    getDto: GetBusinessDto,
    userId: string,
  ): Promise<ResponsePaginationDto<any>> {
    const page = Number(getDto.page) || 1;
    const take = Number(getDto.limit) || 10;
    const skip = (page - 1) * take;
    const conditions = {
      userId: userId,
    };

    if (getDto.search) {
      conditions['name'] = ILike(`%${getDto.search}%`);
    }

    const query: FindManyOptions<Business> = {
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      where: conditions,
      relations: ['businessType'],
      skip,
      take,
    };

    const [data, total] = await this.businessRepository.findAndCount(query);
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

  async findOne(id: string, userId: string): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { id, userId },
    });
    if (!business) throw new NotFoundException('Business not found');
    return business;
  }

  async update(id: string, updateBusinessDto: BusinessDto, userId: string) {
    try {
      const business = await this.findOne(id, userId);
      if (!business) throw new NotFoundException('Business not found');
      this.businessRepository.update(id, updateBusinessDto);
      return {
        result: { name: updateBusinessDto.name },
        message: 'Business updated successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string, userId: string) {
    try {
      const result = await this.businessRepository.update(
        { id, userId },
        { deletedAt: new Date() },
      );
      if (result.affected === 0) {
        throw new NotFoundException('Business not found');
      }

      return {
        result: true,
        message: 'Business removed successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async findAllDropdown(getDto: GetBusinessDto, userId: string) {
    try {
      const conditions = {
        userId: userId,
      };

      if (getDto.search) {
        conditions['name'] = ILike(`%${getDto.search}%`);
      }

      const businesses = await this.businessRepository.find({
        select: ['id', 'name'],
        where: conditions,
      });
      return {
        result: businesses,
        message: 'Business dropdown fetched successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
