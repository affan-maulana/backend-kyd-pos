import { Module } from '@nestjs/common';
import { AddOnService } from './add-on.service';
import { AddOnController } from './add-on.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddOn } from './entities/add-on.entity';
import { AddOnGroup } from './entities/add-on-group.entity';
import { OutletModule } from '@module/outlet/outlet.module';
import { OutletService } from '@module/outlet/outlet.service';

@Module({
  imports: [TypeOrmModule.forFeature([AddOn, AddOnGroup]), OutletModule],
  controllers: [AddOnController],
  providers: [
    AddOnService,
    {
      provide: OutletService,
      useValue: {},
    },
  ],
})
export class AddOnModule {}
