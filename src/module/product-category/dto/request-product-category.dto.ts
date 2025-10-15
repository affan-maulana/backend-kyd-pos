import { OutletScopedDto } from '@common/dto/outlet-scoped.dto';
import { RequestPaginationOutletScopedDto } from '@common/dto/pagination.dto';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ProductCategoryDto extends OutletScopedDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;
}

export class GetProductCategoryDto extends IntersectionType(
  ProductCategoryDto,
  RequestPaginationOutletScopedDto,
) {}
