import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateBundleItemDto } from './dto/create-bundle-item.dto';
import { UpdateBundleItemDto } from './dto/update-bundle-item.dto';
import { BundleItemService } from './bundle-item.service';

@Controller('bundle-items')
export class BundleItemController {
  constructor(private readonly bundleItemService: BundleItemService) {}

  @Post()
  create(@Body() dto: CreateBundleItemDto) {
    return this.bundleItemService.addBundleItem(dto);
  }

  @Get('bundle/:bundleId')
  findByBundleId(@Param('bundleId', ParseUUIDPipe) bundleId: string) {
    return this.bundleItemService.getBundleItems(bundleId);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBundleItemDto,
  ) {
    return this.bundleItemService.updateBundleItem(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.bundleItemService.deleteBundleItem(id);
  }
}
