import { IsNumber, IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AssignmentType } from '../../../entities';

export class CreateBuoyAssignmentDto {
  @ApiProperty({ description: 'ID da boia' })
  @IsNumber()
  @Type(() => Number)
  buoyId: number;

  @ApiPropertyOptional({ description: 'ID da equipe (para atribuição por equipe)' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  teamId?: number;

  @ApiPropertyOptional({ description: 'ID do fiscal (para atribuição por fiscal)' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  inspectorId?: number;

  @ApiProperty({ 
    description: 'Tipo de atribuição',
    enum: AssignmentType
  })
  @IsEnum(AssignmentType)
  assignmentType: AssignmentType;

  @ApiPropertyOptional({ description: 'Data e hora da atribuição (ISO string)' })
  @IsOptional()
  @IsDateString()
  assignedAt?: string;

  @ApiPropertyOptional({ description: 'Observações sobre a atribuição' })
  @IsOptional()
  @IsString()
  notes?: string;
}

