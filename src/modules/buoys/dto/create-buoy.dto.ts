import { IsString, IsNotEmpty, Length, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBuoyDto {
  @ApiProperty({ description: 'Código identificador da boia' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  code: string;

  @ApiPropertyOptional({ description: 'Descrição da boia' })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  description?: string;

  @ApiPropertyOptional({ description: 'Localização da boia' })
  @IsOptional()
  @IsString()
  @Length(0, 200)
  location?: string;

  @ApiPropertyOptional({ description: 'Status ativo da boia', default: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

