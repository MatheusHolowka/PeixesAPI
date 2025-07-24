import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FishService } from './fish.service';
import { FishController } from './fish.controller';
import { FishSpecies, FishCatch, Team, Inspector } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([FishSpecies, FishCatch, Team, Inspector])],
  controllers: [FishController],
  providers: [FishService],
  exports: [FishService],
})
export class FishModule {}

