import { PartialType } from '@nestjs/swagger';
import { CreateBundleItemDto } from './create-bundle-item.dto';

export class UpdateBundleItemDto extends PartialType(CreateBundleItemDto) {}
