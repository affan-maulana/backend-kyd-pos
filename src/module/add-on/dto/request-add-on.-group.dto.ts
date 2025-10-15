import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RequestAddOnDto } from './request-add-on.dto';

export class RequestAddOnGroupDto {
  @ApiProperty({ example: 'Bumbu' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isRequired?: boolean = false;

  @ApiPropertyOptional({ example: 2 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxSelection?: number = 0;

  @ApiPropertyOptional({ type: [RequestAddOnDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RequestAddOnDto)
  @IsOptional()
  addOns?: RequestAddOnDto[];

  @ApiProperty({ example: '9c6cef82-9a91-4487-a987-3f91c1e6ab54' })
  @IsString()
  @IsNotEmpty()
  outletId: string;
}
