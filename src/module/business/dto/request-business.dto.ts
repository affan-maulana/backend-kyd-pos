import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RequestPaginationDto } from '@common/dto/pagination.dto';

export class BusinessDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Detail Business' })
  name: string;
}

export class GetBusinessDto extends RequestPaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}

export class CreateBusinessDto extends BusinessDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: '9a1a26fa-a4f1-4d91-85be-793653c27941' })
  businessTypeId: string;
}
