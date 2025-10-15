import { Module } from '@nestjs/common';
import { ProductCategoriesService } from './product-category.service';
import { ProductCategoriesController } from './product-category.controller';
import { ProductCategory } from './entities/product-category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outlet } from '@module/outlet/entities/outlet.entity';
import { ValidationService } from '@helpers/outlet-validation.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory, Outlet])],
  controllers: [ProductCategoriesController],
  providers: [ProductCategoriesService, ValidationService],
})
export class ProductCategoriesModule {}
