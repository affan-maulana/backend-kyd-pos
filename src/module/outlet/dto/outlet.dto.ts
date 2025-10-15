import { ApiProperty } from '@nestjs/swagger';
import { Outlet } from '@module/outlet/entities/outlet.entity';
import { IsString } from 'class-validator';

export class OutletDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  isActive: boolean;

  constructor(partial: Partial<OutletDto>) {
    Object.assign(this, partial);
  }

  static fromEntity(outlet: Outlet): OutletDto {
    return new OutletDto({
      id: outlet.id,
      name: outlet.name,
      address: outlet.address,
      isActive: outlet.isActive,
    });
  }
}
