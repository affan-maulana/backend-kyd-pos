import { IsUUID } from 'class-validator';

export class UpdateCategoryProductDto {
  @IsUUID()
  outletId: string;

  @IsUUID()
  productCategoryId: string;
}
