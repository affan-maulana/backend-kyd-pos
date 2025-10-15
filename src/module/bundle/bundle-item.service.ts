import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BundleItem } from './entities/bundle-item.entity';
import { Bundle } from './entities/bundle.entity';
import { Repository } from 'typeorm';
import { CreateBundleItemDto } from './dto/create-bundle-item.dto';
import { UpdateBundleItemDto } from './dto/update-bundle-item.dto';

@Injectable()
export class BundleItemService {
  constructor(
    @InjectRepository(Bundle)
    private readonly bundleRepo: Repository<Bundle>,

    @InjectRepository(BundleItem)
    private readonly itemRepo: Repository<BundleItem>,
  ) {}

  async addBundleItem(dto: CreateBundleItemDto): Promise<BundleItem> {
    const item = this.itemRepo.create(dto);
    return this.itemRepo.save(item);
  }

  async updateBundleItem(
    id: string,
    dto: UpdateBundleItemDto,
  ): Promise<BundleItem> {
    const item = await this.itemRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Bundle item not found');
    Object.assign(item, dto);
    return this.itemRepo.save(item);
  }

  async deleteBundleItem(id: string): Promise<void> {
    const result = await this.itemRepo.delete(id);
    if (!result.affected) throw new NotFoundException('Bundle item not found');
  }

  async getBundleItems(bundleId: string): Promise<BundleItem[]> {
    return this.itemRepo.find({
      where: { bundleId },
      relations: ['productVariant'],
    });
  }
}
