import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductVariantFavoriteService } from './product-variant-favorite.service';
import { CreateProductVariantFavoriteDto } from './dto/create-product-variant-favorite.dto';
import { UpdateProductVariantFavoriteDto } from './dto/update-product-variant-favorite.dto';

@Controller('product-variant-favorite')
export class ProductVariantFavoriteController {
  constructor(
    private readonly productVariantFavoriteService: ProductVariantFavoriteService,
  ) {}

  @Post()
  create(
    @Body() createProductVariantFavoriteDto: CreateProductVariantFavoriteDto,
  ) {
    return this.productVariantFavoriteService.create(
      createProductVariantFavoriteDto,
    );
  }

  @Get()
  findAll() {
    return this.productVariantFavoriteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productVariantFavoriteService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductVariantFavoriteDto: UpdateProductVariantFavoriteDto,
  ) {
    return this.productVariantFavoriteService.update(
      +id,
      updateProductVariantFavoriteDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productVariantFavoriteService.remove(+id);
  }
}
