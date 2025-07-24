import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspectorsService } from './inspectors.service';
import { InspectorsController } from './inspectors.controller';
import { Inspector } from '../../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Inspector])],
  controllers: [InspectorsController],
  providers: [InspectorsService],
  exports: [InspectorsService],
})
export class InspectorsModule {}

