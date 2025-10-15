import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Bundle } from './entities/bundle.entity';
import { BundleItem } from './entities/bundle-item.entity';
import { CreateBundleDto } from './dto/create-bundle.dto';
import { UpdateBundleDto } from './dto/update-bundle.dto';
import { CreateBundleItemDto } from './dto/create-bundle-item.dto';
import { Product } from '@module/product/entities/product.entity';
import { ProductVariant } from '@module/product-variant/entities/product-variant.entity';
import { GetBundleDto } from './dto/get-bundle.dto';
import { PageUtil } from '@common/page.util';
import { Page } from '@common/model/page';

@Injectable()
export class BundleService {
  constructor(
    @InjectRepository(Bundle)
    private readonly bundleRepo: Repository<Bundle>,

    @InjectRepository(BundleItem)
    private readonly itemRepo: Repository<BundleItem>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(ProductVariant)
    private readonly productVariantRepo: Repository<ProductVariant>,
  ) {}

  async createBundle(dto: CreateBundleDto): Promise<Bundle> {
    // trim inputs
    dto.name = dto.name.trim();
    dto.description = dto.description?.trim();

    // validation
    await Promise.all([
      this.checkDuplicateName(dto.name, dto.outletId),
      this.checkProduct(dto.productId),
      this.checkProductVariants(dto.items),
    ]);

    const bundle = this.bundleRepo.create(dto);
    const result = await this.bundleRepo.save(bundle);

    return result;
  }

  async findAllBundles(getBundleDto: GetBundleDto): Promise<Bundle[]> {
    return this.queryBundles(getBundleDto.outletId);
  }

  async findAll(
    queryDto: GetBundleDto,
    outletId: string,
  ): Promise<Page<Bundle>> {
    if (!outletId) {
      throw new BadRequestException('Outlet ID is required');
    }

    const { page, limit } = queryDto;
    const pageUtil = new PageUtil(page, limit);

    const queryBuilder = this.bundleRepo
      .createQueryBuilder('bundle')
      .leftJoinAndSelect('bundle.items', 'bundleItem')
      .leftJoinAndSelect('bundleItem.productVariant', 'productVariant')
      .leftJoinAndSelect('productVariant.product', 'product')
      .where('bundle.outletId = :outletId', { outletId })
      .andWhere('product.deletedAt IS NULL')
      .select([
        'bundle.id',
        'bundle.name',
        'bundle.description',
        'bundle.price',
        'bundle.isActive',
        'bundle.createdAt',
        'bundle.updatedAt',
        'bundleItem.id',
        'bundleItem.quantity',
        'productVariant.id',
        'productVariant.name',
      ])
      .orderBy('bundle.createdAt', 'DESC');

    if (queryDto.search) {
      queryBuilder.andWhere('bundle.name ILIKE :search', {
        search: `%${queryDto.search}%`,
      });
    }

    if (queryDto.name) {
      queryBuilder.andWhere('bundle.name ILIKE :name', {
        name: `%${queryDto.name}%`,
      });
    }

    if (queryDto.isActive !== undefined) {
      queryBuilder.andWhere('bundle.isActive = :isActive', {
        isActive: queryDto.isActive,
      });
    }

    const [data, total] = await queryBuilder
      .skip(pageUtil.skipRecord())
      .take(pageUtil.limit)
      .getManyAndCount();

    return new Page(data, total, pageUtil);
  }

  async findOneBundle(id: string, outletId: string): Promise<Bundle> {
    const queryBuilder = this.bundleRepo
      .createQueryBuilder('bundle')
      .leftJoinAndSelect('bundle.items', 'bundleItem')
      .leftJoinAndSelect('bundleItem.productVariant', 'productVariant')
      .leftJoinAndSelect('productVariant.product', 'product')
      .where('bundle.id = :id', { id })
      .andWhere('bundle.outletId = :outletId', { outletId })
      .andWhere('product.deletedAt IS NULL')
      .select([
        'bundle.id',
        'bundle.name',
        'bundle.description',
        'bundle.price',
        'bundle.isActive',
        'bundle.createdAt',
        'bundle.updatedAt',
        'bundleItem.id',
        'bundleItem.quantity',
        'productVariant.id',
        'productVariant.name',
      ]);

    const bundle = await queryBuilder.getOne();

    if (!bundle) {
      throw new NotFoundException(`Bundle with ID ${id} not found`);
    }

    return bundle;
  }

  async updateBundle(id: string, dto: UpdateBundleDto): Promise<any> {
    try {
      await Promise.all([
        this.checkDuplicateName(dto.name, dto.outletId, id),
        this.checkProduct(dto.productId),
        this.checkProductVariants(dto.items),
      ]);

      const bundle = await this.queryBundles(dto.outletId, id);
      Object.assign(bundle, dto);
      return this.bundleRepo.save(bundle);
    } catch (error) {
      throw error;
    }
  }

  async deleteBundle(id: string): Promise<void> {
    try {
      const bundle = await this.bundleRepo.findOne({ where: { id } });

      if (!bundle) {
        throw new NotFoundException('Bundle not found');
      }
      const product = await this.productRepo.findOne({
        where: { id: bundle.productId },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }
      product.deletedAt = new Date();
      await this.productRepo.save(product);

      bundle.isActive = false;
      await this.bundleRepo.save(bundle);
    } catch (error) {
      throw error;
    }
  }

  async queryBundles(outletId: string, id = null) {
    const query = this.bundleRepo
      .createQueryBuilder('bundle')
      .leftJoinAndSelect('bundle.items', 'bundleItem')
      .leftJoinAndSelect('bundleItem.productVariant', 'productVariant')
      .leftJoinAndSelect('productVariant.product', 'product')
      .andWhere('product.deletedAt IS NULL')
      .select([
        'bundle.id',
        'bundle.name',
        'bundle.description',
        'bundle.price',
        'bundle.isActive',
        'bundle.createdAt',
        'bundle.updatedAt',
        'bundleItem.id',
        'bundleItem.quantity',
        'productVariant.id',
        'productVariant.name', // Nama variant
        // 'product.id', // Include ID product (optional)
      ]);

    query.where('bundle.outletId = :outletId', { outletId: outletId });
    if (id) {
      query.andWhere('bundle.id = :id', { id: id });
    }
    return query.getMany();
  }

  async checkDuplicateName(
    name: string,
    outletId: string,
    id?: string,
  ): Promise<void> {
    const bundle = await this.bundleRepo.findOne({
      where: { name, outletId },
    });
    if (bundle && id !== bundle.id) {
      throw new NotFoundException('Bundle name already exists');
    }
  }

  async checkProduct(productId: string): Promise<void> {
    const product = await this.productRepo.findOne({
      select: ['id'],
      where: {
        id: productId,
        isActive: true,
        deletedAt: null,
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const getBundle = await this.bundleRepo.findOne({
      select: ['id'],
      where: {
        productId,
      },
    });
    if (getBundle) {
      throw new NotFoundException('Product already exist in bundle');
    }
  }

  async checkProductVariants(items: CreateBundleItemDto[]): Promise<void> {
    for (const item of items) {
      const productVariant = await this.productVariantRepo.findOne({
        where: {
          id: item.productVariantId,
          isActive: true,
          deletedAt: null,
        },
      });
      if (!productVariant) {
        throw new NotFoundException('Product variant not found');
      }
    }
  }
}
