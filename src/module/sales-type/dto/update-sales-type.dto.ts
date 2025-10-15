import { PartialType } from '@nestjs/swagger';
import { CreateSalesTypeDto } from './create-sales-type.dto';

export class UpdateSalesTypeDto extends PartialType(CreateSalesTypeDto) {}
