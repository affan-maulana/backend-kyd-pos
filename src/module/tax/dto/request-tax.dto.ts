import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { OutletScopedDto } from '@common/dto/outlet-scoped.dto';
import { RequestPaginationOutletScopedDto } from '@common/dto/pagination.dto';

export class TaxDto extends OutletScopedDto {
  @ApiProperty({ description: 'Tax name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Tax amount (percentage)', example: 10.5 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  amount: number;

  @ApiPropertyOptional({ description: 'Is active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class GetTaxDto extends RequestPaginationOutletScopedDto {
  @ApiProperty({ description: 'Tax name' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'Tax amount (percentage)', example: 10.5 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Min(0)
  @Max(100)
  amount: number;

  @ApiPropertyOptional({ description: 'Is active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateTaxDto {
  @ApiPropertyOptional({ description: 'Tax name' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ description: 'Tax amount (percentage)' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  amount?: number;

  @ApiPropertyOptional({ description: 'Is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
