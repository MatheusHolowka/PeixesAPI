import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LaunchesService } from './launches.service';
import { LaunchesController } from './launches.controller';
import { BuoyAssignment, Buoy, Team, Inspector } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([BuoyAssignment, Buoy, Team, Inspector])],
  controllers: [LaunchesController],
  providers: [LaunchesService],
  exports: [LaunchesService],
})
export class LaunchesModule {}

