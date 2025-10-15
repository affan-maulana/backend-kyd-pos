import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { RequestPaginationOutletScopedDto } from '@common/dto/pagination.dto';
import { Transform } from 'class-transformer';

export class GetBundleDto extends RequestPaginationOutletScopedDto {
  @ApiPropertyOptional({ description: 'Search by bundle name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by bundle name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;
}
