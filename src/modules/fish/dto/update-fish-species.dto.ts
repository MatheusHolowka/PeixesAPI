import { PartialType } from '@nestjs/swagger';
import { CreateFishSpeciesDto } from './create-fish-species.dto';

export class UpdateFishSpeciesDto extends PartialType(CreateFishSpeciesDto) {}

