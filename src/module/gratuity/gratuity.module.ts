import { Module } from '@nestjs/common';
import { GratuityService } from './gratuity.service';
import { GratuityController } from './gratuity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gratuity } from './entities/gratuity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gratuity])],
  controllers: [GratuityController],
  providers: [GratuityService],
})
export class GratuityModule {}
