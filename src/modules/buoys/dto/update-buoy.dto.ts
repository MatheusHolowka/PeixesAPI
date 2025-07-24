import { PartialType } from '@nestjs/swagger';
import { CreateBuoyDto } from './create-buoy.dto';

export class UpdateBuoyDto extends PartialType(CreateBuoyDto) {}

