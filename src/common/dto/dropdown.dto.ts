import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DropdownDto {
  @ApiProperty()
  @IsString()
  value: string;

  @ApiProperty()
  @IsString()
  label: string;

  constructor(partial: Partial<DropdownDto>) {
    Object.assign(this, partial);
  }

  static fromEntity<T>(
    entity: T,
    valueKey: keyof T,
    labelKey: keyof T,
  ): DropdownDto {
    return new DropdownDto({
      value: String(entity[valueKey]),
      label: String(entity[labelKey]),
    });
  }

  // Static method custom label format
  static fromCustom<T>(
    item: T,
    valueKey: keyof T,
    formatLabel: (item: T) => string,
  ): DropdownDto {
    return new DropdownDto({
      value: String(item[valueKey]),
      label: formatLabel(item),
    });
  }
}
