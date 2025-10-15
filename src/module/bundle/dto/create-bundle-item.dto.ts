import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min } from 'class-validator';

export class CreateBundleItemDto {
  @ApiProperty()
  @IsUUID()
  bundleId?: string;

  @ApiProperty()
  @IsUUID()
  productVariantId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;
}
