import { Injectable, NotFoundException } from '@nestjs/common';
import { GetStaffDto, StaffDto } from './dto/request-staff.dto';
import { Brackets, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { ResponsePaginationDto } from '@common/dto/response-pagination.dto';
import { Outlet } from '@module/outlet/entities/outlet.entity';
import { ValidationService } from '@helpers/outlet-validation.service';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,

    private validationService: ValidationService,

    // outletRepository
    @InjectRepository(Outlet)
    private readonly outletRepository: Repository<Outlet>,
  ) {}

  async create(staffDto: StaffDto, businessId: string) {
    try {
      const validateOutlet = await this.validationService.validateOutlet(
        staffDto.outletId,
        businessId,
      );

      if (!validateOutlet) {
        throw new NotFoundException('Outlet not found');
      }

      await this.checkDuplicateName(
        staffDto.firstname,
        staffDto.lastname,
        businessId,
      );

      const staff = this.staffRepository.create({
        ...staffDto,
        firstname: staffDto.firstname.trim(),
        lastname: staffDto.lastname?.trim(),
        description: staffDto.description?.trim(),
        businessId,
      });
      const result = await this.staffRepository.save(staff);
      return {
        result: result,
        message: 'Staff created successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    getDto: GetStaffDto,
    businessId: string,
  ): Promise<ResponsePaginationDto<any>> {
    const page = Number(getDto.page) || 1;
    const take = Number(getDto.limit) || 10;
    const skip = (page - 1) * take;

    const qb = this.staffRepository
      .createQueryBuilder('staff')
      .leftJoinAndSelect('staff.outlet', 'outlet')
      // .where('staff.isDeleted = false')
      .andWhere('staff.businessId = :businessId', { businessId });

    if (getDto.search) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('staff.firstname ILIKE :search').orWhere(
            'staff.lastname ILIKE :search',
          );
        }),
        { search: `%${getDto.search}%` },
      );
    }

    if (getDto.outletId) {
      qb.andWhere('staff.outletId = :outletId', { outletId: getDto.outletId });
    }

    const orderBy = getDto.orderBy || 'staff.createdAt';
    const sort =
      (getDto.sort || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    if (orderBy === 'outlet') {
      qb.orderBy('outlet.name', sort);
    } else {
      qb.orderBy(orderBy, sort);
    }

    qb.skip(skip).take(take);

    const [data, total] = await qb.getManyAndCount();

    const result = data.map((item) => ({
      id: item.id,
      name: `${item.firstname} ${item.lastname}`,
      status: item.status,
      expiresAt: item.expiresAt,
      description: item.description,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      outletId: item.outletId,
      outlet: item.outlet?.name || null,
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

  async findOne(id: string, businessId: string) {
    const conditions = {
      id: id,
      businessId,
    };

    const data = await this.staffRepository.findOne({
      where: conditions,
      select: {
        id: true,
        firstname: true,
        lastname: true,
        description: true,
        status: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return {
      result: data,
    };
  }

  async update(id: string, updateStaffDto: StaffDto, businessId: string) {
    try {
      const existingStaff = await this.staffRepository.findOne({
        where: { id },
      });
      if (!existingStaff) {
        throw new Error('Staff not found');
      }

      await this.checkDuplicateName(
        updateStaffDto.firstname,
        updateStaffDto.lastname,
        businessId,
      );

      await this.staffRepository.update(id, {
        ...updateStaffDto,
        firstname: updateStaffDto.firstname.trim(),
        lastname: updateStaffDto.lastname?.trim(),
        description: updateStaffDto.description?.trim(),
      });
      const result = await this.staffRepository.findOne({
        where: { id },
      });
      return {
        result: result,
        message: 'Staff updated successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const existingStaff = await this.staffRepository.findOne({
        where: {
          id,
        },
      });
      if (!existingStaff) {
        throw new Error('Staff not found');
      }

      await this.staffRepository.update(id, { deletedAt: new Date() });
      return {
        id: id,
        message: 'Staff removed successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async getDropdown(getDto: GetStaffDto) {
    try {
      const conditions = {};

      if (getDto.outletId) {
        conditions['outletId'] = getDto.outletId;
      }

      if (getDto.search) {
        conditions['firstname'] = ILike(`%${getDto.search}%`);
      }

      const staffs = await this.staffRepository.find({
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
        where: conditions,
      });

      const data = staffs.map((item) => ({
        value: item.id,
        label: item.firstname + ' ' + item.lastname,
      }));
      return {
        result: data,
        message: 'Dropdown options fetched successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  // assignToOutlet
  async assignToOutlet(id: string, outletId: string, businessId: string) {
    try {
      const existingStaff = await this.staffRepository.findOne({
        where: {
          id,
          businessId: businessId,
        },
      });
      if (!existingStaff) {
        throw new Error('Staff not found');
      }

      const checkOutlet = await this.outletRepository.findOne({
        where: {
          id: outletId,
          businessId: businessId,
        },
      });
      if (!checkOutlet) {
        throw new Error('Outlet not found');
      }

      if (existingStaff.outletId === outletId) {
        throw new Error('Staff already assigned to an outlet');
      }

      await this.staffRepository.update(id, { outletId });
      return {
        result: {
          id: existingStaff.id,
          outletId: outletId,
        },
        message: 'Staff assigned to outlet successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async checkDuplicateName(
    firstname: string,
    lastname: string,
    businessId: string,
  ) {
    const checkStaff = await this.staffRepository.findOne({
      where: {
        firstname: firstname,
        lastname: lastname,
        businessId: businessId,
        deletedAt: null,
      },
    });
    if (checkStaff) {
      throw new Error('Staff name already exists');
    }
  }
}
