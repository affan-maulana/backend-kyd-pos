import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { Staff } from './entities/staff.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from '@module/business/entities/business.entity';
import { Outlet } from '@module/outlet/entities/outlet.entity';
import { ValidationService } from '@helpers/outlet-validation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, Business, Outlet])],
  controllers: [StaffController],
  providers: [StaffService, ValidationService],
})
export class StaffModule {}
