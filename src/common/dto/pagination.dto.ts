import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class RequestPaginationDto {
  @ApiPropertyOptional({
    default: 10,
    description: 'Jumlah data yang di retrieve',
  })
  @Type(() => Number)
  @IsNumber()
  limit: number = DEFAULT_LIMIT_PAGE;

  @ApiPropertyOptional({
    description: 'Nomor halaman (page)',
    default: 1,
  })
  @Type(() => Number)
  @IsNumber()
  page: number = DEFAULT_PAGE;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sort?: string;
}

export class RequestPaginationOutletScopedDto extends RequestPaginationDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  outletId: string;
}

const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 10;
const DEFAULT_LIMIT_PAGE = DEFAULT_SIZE;
