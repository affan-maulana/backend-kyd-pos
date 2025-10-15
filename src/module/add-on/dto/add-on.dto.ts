import { ApiProperty } from '@nestjs/swagger';
import { AddOn } from '../entities/add-on.entity';

export class AddOnDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'kecap' })
  name: string;

  @ApiProperty({ example: 5000 })
  price: number;

  constructor(partial: Partial<AddOnDto>) {
    Object.assign(this, partial);
  }

  static fromEntity(addOn: AddOn): AddOnDto {
    return new AddOnDto({
      id: addOn.id,
      name: addOn.name,
      price: Number(addOn.price),
    });
  }
}
