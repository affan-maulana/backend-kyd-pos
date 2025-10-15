import { Module } from '@nestjs/common';
import { SalesTypeService } from './sales-type.service';
import { SalesTypeController } from './sales-type.controller';
import { SalesType } from './entities/sales-type.entity';
import { Outlet } from '@module/outlet/entities/outlet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ValidationService } from '@helpers/outlet-validation.service';

@Module({
  imports: [TypeOrmModule.forFeature([SalesType, Outlet])],

  controllers: [SalesTypeController],
  providers: [SalesTypeService, ValidationService],
})
export class SalesTypeModule {}
