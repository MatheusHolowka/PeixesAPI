import { IsNumber, IsOptional, IsString, IsDateString, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateFishCatchDto {
  @ApiProperty({ description: 'ID da equipe' })
  @IsNumber()
  @Type(() => Number)
  teamId: number;

  @ApiProperty({ description: 'ID da espécie de peixe' })
  @IsNumber()
  @Type(() => Number)
  fishSpeciesId: number;

  @ApiPropertyOptional({ description: 'ID do fiscal responsável' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  inspectorId?: number;

  @ApiProperty({ description: 'Tamanho do peixe em centímetros' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  sizeCm: number;

  @ApiPropertyOptional({ description: 'Data e hora da captura (ISO string)' })
  @IsOptional()
  @IsDateString()
  caughtAt?: string;

  @ApiPropertyOptional({ description: 'Observações sobre a captura' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Se a captura é válida', default: true })
  @IsOptional()
  @IsBoolean()
  valid?: boolean;
}

