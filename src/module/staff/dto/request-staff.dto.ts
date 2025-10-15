import { RequestPaginationDto } from '@common/dto/pagination.dto';
import { IntersectionType } from '@nestjs/swagger';
import { StaffBaseDto } from './staff-base.dto';

export class StaffDto extends StaffBaseDto {}

export class GetStaffDto extends IntersectionType(
  StaffBaseDto,
  RequestPaginationDto,
) {}
