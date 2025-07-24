import { PartialType } from '@nestjs/swagger';
import { CreateFishCatchDto } from './create-fish-catch.dto';

export class UpdateFishCatchDto extends PartialType(CreateFishCatchDto) {}

