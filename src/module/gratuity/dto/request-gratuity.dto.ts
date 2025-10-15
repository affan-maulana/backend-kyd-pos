import { OutletScopedDto } from '@common/dto/outlet-scoped.dto';
import { RequestPaginationOutletScopedDto } from '@common/dto/pagination.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GratuityDto extends OutletScopedDto {
  @ApiProperty()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsNumber()
  amount?: number;
}

export class GetGratuityDto extends RequestPaginationOutletScopedDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}
