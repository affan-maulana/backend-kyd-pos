import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxService } from './tax.service';
import { TaxController } from './tax.controller';
import { Tax } from './entities/tax.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tax])],
  controllers: [TaxController],
  providers: [TaxService],
  exports: [TaxService],
})
export class TaxModule {}
