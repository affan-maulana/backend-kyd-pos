import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class OutletScopedDto {
  @ApiProperty()
  @IsUUID()
  @IsString()
  outletId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  createdAt?: string;
}
