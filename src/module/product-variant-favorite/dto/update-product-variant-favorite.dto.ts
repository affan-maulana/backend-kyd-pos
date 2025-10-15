import { PartialType } from '@nestjs/swagger';
import { CreateProductVariantFavoriteDto } from './create-product-variant-favorite.dto';

export class UpdateProductVariantFavoriteDto extends PartialType(
  CreateProductVariantFavoriteDto,
) {}
