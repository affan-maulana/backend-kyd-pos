import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { Business } from '@module/business/entities/business.entity';
import { BusinessType } from '@module/business-type/entities/business-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Business, BusinessType])],
  controllers: [BusinessController],
  providers: [BusinessService],
  exports: [BusinessService],
})
export class BusinessModule {}
