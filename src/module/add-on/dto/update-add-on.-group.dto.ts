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
import { UpdateAddOnDto } from './update-add-on.dto';

export class UpdateAddOnGroupDto {
  @ApiPropertyOptional({ example: 'dbddd946-7c8c-42f8-95ff-2f9c14a22980' })
  @IsString()
  @IsOptional()
  id?: string;

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

  @ApiPropertyOptional({ type: [UpdateAddOnDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAddOnDto)
  @IsOptional()
  addOns?: UpdateAddOnDto[];

  @ApiPropertyOptional({ example: '9c6cef82-9a91-4487-a987-3f91c1e6ab54' })
  @IsString()
  @IsOptional()
  outletId?: string;
}
