import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateAddOnDto {
  @ApiPropertyOptional({ example: '9704482d-e34a-4e2d-b247-91a5249f63d1' })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({ example: 'kecap' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 5000 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;
}
