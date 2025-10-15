import { OutletScopedDto } from '@common/dto/outlet-scoped.dto';
import { RequestPaginationOutletScopedDto } from '@common/dto/pagination.dto';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SalesTypeDto extends OutletScopedDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  isActive?: string;
}

export class GetSalesTypeDto extends IntersectionType(
  SalesTypeDto,
  RequestPaginationOutletScopedDto,
) {}
