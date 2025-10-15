import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product-category.entity';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import {
  GetProductCategoryDto,
  ProductCategoryDto,
} from './dto/request-product-category.dto';
import { ResponsePaginationDto } from '@common/dto/response-pagination.dto';
import { ValidationService } from '@helpers/outlet-validation.service';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,

    private validationService: ValidationService,
  ) {}

  async create(productCategoryDto: ProductCategoryDto, businessId: string) {
    try {
      const validateOutlet = await this.validationService.validateOutlet(
        productCategoryDto.outletId,
        businessId,
      );

      if (!validateOutlet) {
        throw new NotFoundException('Outlet not found');
      }

      const checkDuplicate = await this.productCategoryRepository.findOne({
        where: {
          name: productCategoryDto.name,
          outletId: productCategoryDto.outletId,
        },
      });

      if (checkDuplicate) {
        throw new BadRequestException('Product Category already exists');
      }

      const productCategory =
        this.productCategoryRepository.create(productCategoryDto);
      const result = await this.productCategoryRepository.save(productCategory);
      return {
        result: result,
        message: 'Product Category created successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(
    getDto: GetProductCategoryDto,
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
    const conditions = {
      outletId: getDto.outletId,
    };

    if (getDto.search) {
      conditions['name'] = ILike(`%${getDto.search}%`);
    }

    const query: FindManyOptions<ProductCategory> = {
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

    const [data, total] =
      await this.productCategoryRepository.findAndCount(query);
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

  async findOne(id: string, outletId: string, businessId: string) {
    const validateOutlet = await this.validationService.validateOutlet(
      outletId,
      businessId,
    );

    if (!validateOutlet) {
      throw new NotFoundException('Outlet not found');
    }

    const data = await this.productCategoryRepository.findOne({
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

  async update(
    id: string,
    updateProductCategoryDto: ProductCategoryDto,
    businessId: string,
  ) {
    try {
      const validateOutlet = await this.validationService.validateOutlet(
        updateProductCategoryDto.outletId,
        businessId,
      );

      if (!validateOutlet) {
        throw new NotFoundException('Outlet not found');
      }

      const existingProductCategory =
        await this.productCategoryRepository.findOne({
          where: { id },
        });
      if (!existingProductCategory) {
        throw new Error('ProductCategory not found');
      }

      const updateData = { ...updateProductCategoryDto, updatedAt: new Date() };
      await this.productCategoryRepository.update(id, updateData);
      const result = await this.productCategoryRepository.findOne({
        where: { id },
      });
      return {
        result: result,
        message: 'Product Category updated successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string, outletId: string, businessId: string) {
    try {
      const validateOutlet = await this.validationService.validateOutlet(
        outletId,
        businessId,
      );

      if (!validateOutlet) {
        throw new NotFoundException('Outlet not found');
      }

      const existingStaff = await this.productCategoryRepository.findOne({
        where: { id },
      });
      if (!existingStaff) {
        throw new Error('Product Category not found');
      }

      await this.productCategoryRepository.update(id, {
        deletedAt: new Date(),
      });
      return {
        id: id,
        message: 'Product Category removed successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async getDropdown(getDto: GetProductCategoryDto, businessId: string) {
    try {
      const validateOutlet = await this.validationService.validateOutlet(
        getDto.outletId,
        businessId,
      );

      if (!validateOutlet) {
        throw new NotFoundException('Outlet not found');
      }

      const conditions = {
        outletId: getDto.outletId,
      };

      if (getDto.search) {
        conditions['name'] = ILike(`%${getDto.search}%`);
      }

      const productCategorys = await this.productCategoryRepository.find({
        select: {
          id: true,
          name: true,
        },
        where: conditions,
      });
      const data = productCategorys.map((item) => ({
        value: item.id,
        label: item.name,
      }));
      return {
        result: data,
        message: 'Dropdown options fetched successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
