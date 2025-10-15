import { Module } from '@nestjs/common';
import { OutletService } from './outlet.service';
import { OutletController } from './outlet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outlet } from '@module/outlet/entities/outlet.entity';
import { BusinessModule } from '@module/business/business.module';

@Module({
  imports: [TypeOrmModule.forFeature([Outlet]), BusinessModule],
  controllers: [OutletController],
  providers: [OutletService],
})
export class OutletModule {}
