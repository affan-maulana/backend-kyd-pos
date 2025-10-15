import {
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class CreateProductVariantDto {
  @IsUUID()
  productId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  costPrice?: number = 0;

  @IsOptional()
  @IsInt()
  stock?: number = 0;

  @IsOptional()
  @IsBoolean()
  trackStock?: boolean = true;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsInt()
  sequence?: number = 0;
}
