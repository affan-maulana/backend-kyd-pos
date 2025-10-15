import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProductDto {
  @IsUUID()
  outletId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsOptional()
  @IsBoolean()
  isBundle?: boolean = false;

  @IsUUID()
  productCategoryId: string;

  @IsOptional()
  @IsBoolean()
  is?: boolean = true;
}
