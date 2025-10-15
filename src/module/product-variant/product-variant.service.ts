import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariant } from '@module/product-variant/entities/product-variant.entity';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { Product } from '@module/product/entities/product.entity';
import { GetProductVariantDto } from './dto/request-product-variant.dto';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly variantRepo: Repository<ProductVariant>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(dto: CreateProductVariantDto) {
    try {
      const product = await this.productRepo.findOne({
        where: { id: dto.productId },
      });
      if (!product) {
        throw new NotFoundException(
          `Product with id ${dto.productId} not found`,
        );
      }

      const existingVariant = await this.variantRepo.findOne({
        where: { name: dto.name },
      });
      if (existingVariant) {
        throw new BadRequestException(
          `Variant with name ${dto.name} already exists`,
        );
      }

      // validasi duplicate sku
      if (dto.sku) {
        const existingSku = await this.variantRepo.findOne({
          where: { sku: dto.sku },
        });
        if (existingSku) {
          throw new BadRequestException(
            `Variant with sku ${dto.sku} already exists`,
          );
        }
      }

      // validasi duplicate barcode
      if (dto.barcode) {
        const existingBarcode = await this.variantRepo.findOne({
          where: { barcode: dto.barcode },
        });
        if (existingBarcode) {
          throw new BadRequestException(
            `Variant with barcode ${dto.barcode} already exists`,
          );
        }
      }

      dto.name = dto.name.trim();
      dto.sku = dto.sku?.trim();
      dto.barcode = dto.barcode?.trim();

      // get sequence using count
      const count = await this.variantRepo.count({
        where: { productId: product.id },
      });
      dto.sequence = count + 1;

      const variant = this.variantRepo.create({
        ...dto,
        product: { id: product.id }, // Only need product ID for relation
      });

      const result = await this.variantRepo.save(variant);

      return {
        result: result,
        message: 'Product Category created successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(getDto: GetProductVariantDto) {
    const page = Number(getDto.page) || 1;
    const take = Number(getDto.limit) || 10;
    const skip = (page - 1) * take;
    const conditions = {};

    if (getDto.productId) {
      conditions['productId'] = getDto.productId;
    }

    if (getDto.search) {
      conditions['name'] = ILike(`%${getDto.search}%`);
    }

    // sku
    if (getDto.sku) {
      conditions['sku'] = ILike(`%${getDto.sku}%`);
    }

    // barcode
    if (getDto.barcode) {
      conditions['barcode'] = ILike(`%${getDto.barcode}%`);
    }

    // is active
    if (getDto.isActive) {
      conditions['isActive'] = getDto.isActive;
    }

    // track stock
    if (getDto.trackStock) {
      conditions['trackStock'] = getDto.trackStock;
    }

    const query: FindManyOptions<ProductVariant> = {
      select: {
        id: true,
        productId: true,
        name: true,
        sku: true,
        price: true,
        costPrice: true,
        stock: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        barcode: true,
        trackStock: true,
        unit: true,
        sequence: true,
      },
      where: conditions,
      skip,
      take,
      relations: ['product'],
      order: {
        name: 'ASC',
      },
    };

    const [data, total] = await this.variantRepo.findAndCount(query);
    const result = data.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.name,
      sku: item.sku,
      price: item.price,
      costPrice: item.costPrice,
      stock: item.stock,
      isActive: item.isActive,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      barcode: item.barcode,
      trackStock: item.trackStock,
      unit: item.unit,
      sequence: item.sequence,
      productName: item.product.name,
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
    const variant = await this.variantRepo.findOne({
      where: { id },
    });

    if (!variant) {
      throw new NotFoundException(`ProductVariant with id ${id} not found`);
    }

    return {
      result: variant,
      message: 'Product variant found successfully',
    };
  }

  async update(id: string, dto: UpdateProductVariantDto) {
    try {
      const variant = await this.variantRepo.findOne({
        where: { id },
      });

      if (!variant) {
        throw new NotFoundException(`ProductVariant with id ${id} not found`);
      }

      dto.name = dto.name.trim();
      dto.sku = dto.sku?.trim();
      dto.barcode = dto.barcode?.trim();

      const existingVariant = await this.variantRepo.findOne({
        where: {
          name: dto.name,
          productId: variant.productId,
        },
      });

      if (existingVariant && existingVariant.id !== id) {
        throw new BadRequestException(
          `Variant with name ${dto.name} already exists`,
        );
      }

      Object.assign(variant, dto);

      const result = await this.variantRepo.save(variant);

      return {
        result: result,
        message: 'Product variant updated successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const variant = await this.variantRepo.findOne({
        where: { id },
      });

      if (!variant) {
        throw new NotFoundException(`ProductVariant with id ${id} not found`);
      }

      await this.variantRepo.softRemove(variant); // soft delete

      return {
        result: null,
        message: 'Product variant removed successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
