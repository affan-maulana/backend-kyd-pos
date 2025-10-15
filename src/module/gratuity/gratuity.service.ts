import { ResponsePaginationDto } from '@common/dto/response-pagination.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gratuity } from './entities/gratuity.entity';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { GetGratuityDto, GratuityDto } from './dto/request-gratuity.dto';

@Injectable()
export class GratuityService {
  constructor(
    @InjectRepository(Gratuity)
    private readonly gratuityRepository: Repository<Gratuity>,
  ) {}

  async create(gratuityDto: GratuityDto) {
    try {
      const gratuity = this.gratuityRepository.create(gratuityDto);
      const result = await this.gratuityRepository.save(gratuity);
      return {
        result: result,
        message: 'Gratuity created successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(getDto: GetGratuityDto): Promise<ResponsePaginationDto<any>> {
    const page = Number(getDto.page) || 1;
    const take = Number(getDto.limit) || 10;
    const skip = (page - 1) * take;
    const conditions = {
      outletId: getDto.outletId,
    };

    if (getDto.search) {
      conditions['name'] = ILike(`%${getDto.search}%`);
    }

    const query: FindManyOptions<Gratuity> = {
      select: {
        id: true,
        name: true,
        amount: true,
        createdAt: true,
        updatedAt: true,
      },
      where: conditions,
      skip,
      take,
    };

    const [data, total] = await this.gratuityRepository.findAndCount(query);
    const result = data.map((item) => ({
      id: item.id,
      name: item.name,
      amount: item.amount,
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

  async findOne(id: string, outletId: string) {
    const conditions = {
      id: id,
      outletId: outletId,
    };

    const data = await this.gratuityRepository.findOne({
      where: conditions,
      select: {
        id: true,
        name: true,
        amount: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return {
      result: data,
    };
  }

  async update(id: string, updateGratuityDto: GratuityDto) {
    try {
      const existingGratuity = await this.gratuityRepository.findOne({
        where: {
          id,
          outletId: updateGratuityDto.outletId,
        },
      });
      if (!existingGratuity) {
        throw new Error('Gratuity not found');
      }

      const updateData = { ...updateGratuityDto, updatedAt: new Date() };
      await this.gratuityRepository.update(id, updateData);
      const result = await this.gratuityRepository.findOne({
        where: { id },
      });
      return {
        result: result,
        message: 'Gratuity updated successfully',
      };
    } catch (error) {
      throw new Error('Error updating Gratuity: ' + error.message);
    }
  }

  async remove(id: string, outletId: string) {
    try {
      const existingStaff = await this.gratuityRepository.findOne({
        where: {
          id,
          outletId,
        },
      });
      if (!existingStaff) {
        throw new Error('Gratuity not found');
      }

      await this.gratuityRepository.update(id, { deletedAt: new Date() });
      return {
        id: id,
        message: 'Gratuity removed successfully',
      };
    } catch (error) {
      throw new Error('Error removing Gratuity: ' + error.message);
    }
  }

  async getDropdown(getDto: GetGratuityDto): Promise<Gratuity[]> {
    try {
      const conditions = {
        outletId: getDto.outletId,
      };

      if (getDto.search) {
        conditions['name'] = ILike(`%${getDto.search}%`);
      }

      return await this.gratuityRepository.find({
        select: {
          id: true,
          name: true,
          amount: true,
        },
        where: conditions,
      });
    } catch (error) {
      throw new Error('Error fetching dropdown options: ' + error.message);
    }
  }
}
