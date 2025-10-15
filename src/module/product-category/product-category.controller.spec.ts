import { Test, TestingModule } from '@nestjs/testing';
import { ProductCategoriesController } from './product-category.controller';
import { ProductCategoriesService } from './product-category.service';

describe('ProductCategoriesController', () => {
  let controller: ProductCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductCategoriesController],
      providers: [ProductCategoriesService],
    }).compile();

    controller = module.get<ProductCategoriesController>(
      ProductCategoriesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
