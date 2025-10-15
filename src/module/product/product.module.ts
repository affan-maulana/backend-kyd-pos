import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@module/product/entities/product.entity';
import { ProductVariant } from '@module/product-variant/entities/product-variant.entity';
import { ProductAddOnsGroup } from '@module/add-on/entities/product-add-on-group.entity';
import { ValidationService } from '@helpers/outlet-validation.service';
import { Outlet } from '@module/outlet/entities/outlet.entity';
import { ProductCategory } from '../product-category/entities/product-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductVariant,
      ProductAddOnsGroup,
      Outlet,
      ProductCategory,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ValidationService],
})
export class ProductModule {}
