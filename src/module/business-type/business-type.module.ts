import { Module } from '@nestjs/common';
import { BusinessTypeService } from './business-type.service';
import { BusinessTypeController } from './business-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessType } from '@module/business-type/entities/business-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessType])],
  controllers: [BusinessTypeController],
  providers: [BusinessTypeService],
})
export class BusinessTypeModule {}
