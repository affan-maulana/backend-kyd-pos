import { Injectable } from '@nestjs/common';
import { CreateProductVariantFavoriteDto } from './dto/create-product-variant-favorite.dto';
import { UpdateProductVariantFavoriteDto } from './dto/update-product-variant-favorite.dto';

@Injectable()
export class ProductVariantFavoriteService {
  create(createProductVariantFavoriteDto: CreateProductVariantFavoriteDto) {
    return 'This action adds a new productVariantFavorite';
  }

  findAll() {
    return `This action returns all productVariantFavorite`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productVariantFavorite`;
  }

  update(
    id: number,
    updateProductVariantFavoriteDto: UpdateProductVariantFavoriteDto,
  ) {
    return `This action updates a #${id} productVariantFavorite`;
  }

  remove(id: number) {
    return `This action removes a #${id} productVariantFavorite`;
  }
}
