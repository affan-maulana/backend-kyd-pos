import { RequestPaginationDto } from '@common/dto/pagination.dto';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ProductvariantDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  productId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  trackStock?: boolean;
}

export class GetProductVariantDto extends IntersectionType(
  ProductvariantDto,
  RequestPaginationDto,
) {}
