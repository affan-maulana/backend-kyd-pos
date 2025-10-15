// validation.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Outlet } from '@module/outlet/entities/outlet.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ValidationService {
  constructor(
    @InjectRepository(Outlet)
    private outletRepository: Repository<Outlet>,
  ) {}

  async validateOutlet(outletId: string, businessId: string): Promise<Outlet> {
    console.log('validateOutlet', outletId, businessId);

    const outlet = await this.outletRepository.findOne({
      where: {
        id: outletId,
        businessId: businessId,
      },
    });

    if (!outlet) {
      return null;
    }

    return outlet;
  }
}
