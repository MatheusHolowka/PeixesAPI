import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInspectorDto {
  @ApiProperty({ description: 'Nome do fiscal' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;
}

