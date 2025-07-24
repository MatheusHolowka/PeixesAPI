import { PartialType } from '@nestjs/swagger';
import { CreateBuoyAssignmentDto } from './create-buoy-assignment.dto';

export class UpdateBuoyAssignmentDto extends PartialType(CreateBuoyAssignmentDto) {}

