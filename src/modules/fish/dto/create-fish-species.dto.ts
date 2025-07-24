import { IsString, IsNotEmpty, Length, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateFishSpeciesDto {
  @ApiProperty({ description: 'Nome da espécie de peixe' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @ApiProperty({ description: 'Pontos por centímetro do peixe' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  pointsPerCm: number;

  @ApiPropertyOptional({ description: 'Tamanho mínimo em CM para ser válido', default: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  minimumSize?: number;

  @ApiPropertyOptional({ description: 'Descrição da espécie' })
  @IsOptional()
  @IsString()
  description?: string;
}

