import { RequestPaginationDto } from '@common/dto/pagination.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class OutletQueryDto extends RequestPaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;
}
