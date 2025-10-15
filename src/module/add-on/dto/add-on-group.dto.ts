import { ApiProperty } from '@nestjs/swagger';
import { AddOnDto } from './add-on.dto';
import { Outlet } from '@module/outlet/entities/outlet.entity';
import { AddOnGroup } from '../entities/add-on-group.entity';

export class AddOnGroupDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Bumbu' })
  name: string;

  @ApiProperty({ example: true })
  isRequired: boolean;

  @ApiProperty({ example: 2 })
  maxSelection: number;

  @ApiProperty({ type: [AddOnDto] })
  addOns: AddOnDto[];

  @ApiProperty({ type: Outlet })
  outlet: Outlet;

  constructor(partial: Partial<AddOnGroupDto>) {
    Object.assign(this, partial);
  }

  static fromEntity(addOnGroup: AddOnGroup): AddOnGroupDto {
    return new AddOnGroupDto({
      id: addOnGroup.id,
      name: addOnGroup.name,
      isRequired: addOnGroup.isRequired,
      maxSelection: addOnGroup.maxSelection,
      outlet: addOnGroup.outlet,
      addOns:
        addOnGroup.addOns?.map((addOn: any) => AddOnDto.fromEntity(addOn)) ||
        [],
    });
  }
}
