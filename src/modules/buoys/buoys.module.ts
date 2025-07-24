import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuoysService } from './buoys.service';
import { BuoysController } from './buoys.controller';
import { Buoy } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Buoy])],
  controllers: [BuoysController],
  providers: [BuoysService],
  exports: [BuoysService],
})
export class BuoysModule {}

