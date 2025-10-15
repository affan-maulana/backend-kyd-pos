import { OutletScopedDto } from '@common/dto/outlet-scoped.dto';
import { RequestPaginationOutletScopedDto } from '@common/dto/pagination.dto';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ProductDto extends OutletScopedDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;
}

export class GetProductDto extends IntersectionType(
  ProductDto,
  RequestPaginationOutletScopedDto,
) {}

export class DropdownProductDto extends OutletScopedDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  productCategoryId?: string;
}
