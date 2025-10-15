import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
// import { QueryProductDto } from './dto/query-product.dto';
import { Product } from '@module/product/entities/product.entity';
import { ValidationService } from '@helpers/outlet-validation.service';
import { GetProductDto } from './dto/request-product.dto';
import { ResponsePaginationDto } from '@common/dto/response-pagination.dto';
import { UpdateCategoryProductDto } from './dto/update-product-category-product.dto';
import { ProductCategory } from '../product-category/entities/product-category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(ProductCategory)
    private readonly productCategoryRepo: Repository<ProductCategory>,

    private validationService: ValidationService,
  ) {}

  async checkDuplicateName(name: string, outletId: string) {
    const checkProduct = await this.productRepo.findOne({
      where: {
        name: name,
        outletId: outletId,
        deletedAt: null,
      },
    });

    if (checkProduct) {
      throw new BadRequestException('Product name already exist');
    }
  }

  async create(dto: CreateProductDto, businessId: string): Promise<Product> {
    const validateOutlet = await this.validationService.validateOutlet(
      dto.outletId,
      businessId,
    );

    if (!validateOutlet) {
      throw new NotFoundException('Outlet not found');
    }

    dto.name = dto.name.trim();
    dto.description = dto.description?.trim();

    // check duplicate name by outlet
    await this.checkDuplicateName(dto.name, dto.outletId);

    const product = this.productRepo.create({
      ...dto,
    });

    return this.productRepo.save(product);
  }

  async findAll(
    query: GetProductDto,
    businessId: string,
  ): Promise<ResponsePaginationDto<any>> {
    const validateOutlet = await this.validationService.validateOutlet(
      query.outletId,
      businessId,
    );

    if (!validateOutlet) {
      throw new NotFoundException('Outlet not found');
    }
    const page = Number(query.page) || 1;
    const take = Number(query.limit) || 10;
    const skip = (page - 1) * take;
    const orderBy = query.orderBy || 'name';
    const sort = query.sort || 'ASC';

    const where: any = {
      deletedAt: null,
      outletId: query.outletId,
    };

    if (query.search) where.name = ILike(`%${query.search}%`);

    const [data, total] = await this.productRepo.findAndCount({
      where,
      order: {
        [orderBy]: sort.toUpperCase(),
      },
      relations: ['category'],
      take,
      skip,
    });

    const result = data.map((item) => ({
      id: item.id,
      name: item.name,
      productCategoryId: item.category?.id,
      category: item.category?.name,
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

  async getDropdown(
    outletId: string,
    businessId: string,
    search: string,
    productCategoryId?: string,
  ) {
    const validateOutlet = await this.validationService.validateOutlet(
      outletId,
      businessId,
    );

    if (!validateOutlet) {
      throw new NotFoundException('Outlet not found');
    }

    const conditions = { outletId };
    if (search) {
      conditions['name'] = ILike(`%${search}%`);
    }

    if (productCategoryId) {
      conditions['productCategoryId'] = productCategoryId;
    }

    const data = await this.productRepo.find({
      where: conditions,
    });

    return data.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: {
        id,
      },
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepo.findOneBy({ id, deletedAt: null });
    if (!product) throw new NotFoundException('Product not found');

    await this.checkDuplicateName(dto.name, dto.outletId);

    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  async remove(id: string) {
    try {
      const product = await this.productRepo.findOneBy({ id, deletedAt: null });
      if (!product) throw new NotFoundException('Product not found');

      product.deletedAt = new Date();
      await this.productRepo.save(product);
      return {
        message: 'Product removed successfully',
      };
    } catch (error) {
      throw new error();
    }
  }

  async updateCategoryProduct(
    id: string,
    businessId: string,
    updateCategoryProduct: UpdateCategoryProductDto,
  ) {
    try {
      // validate outlet
      const validateOutlet = await this.validationService.validateOutlet(
        updateCategoryProduct.outletId,
        businessId,
      );

      if (!validateOutlet) {
        throw new NotFoundException('Outlet not found');
      }

      const product = await this.productRepo.findOneBy({ id, deletedAt: null });
      if (!product) throw new NotFoundException('Product not found');

      console.log('updateCategoryProduct', updateCategoryProduct);

      const productCategory = await this.productCategoryRepo.findOneBy({
        id: updateCategoryProduct.productCategoryId,
        deletedAt: null,
      });
      if (!productCategory)
        throw new NotFoundException('Product Category not found');

      if (product.outletId !== productCategory.outletId) {
        throw new BadRequestException('Outlet not match');
      }

      product.productCategoryId = updateCategoryProduct.productCategoryId;
      await this.productRepo.save(product);
      return {
        message: 'Product category updated successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
