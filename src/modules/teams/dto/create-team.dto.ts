import { IsString, IsNotEmpty, Length, IsArray, ValidateNested, ArrayMaxSize, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamMemberDto {
  @ApiProperty({ description: 'Nome do componente da equipe' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @ApiProperty({ description: 'Telefone do componente' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  phone: string;
}

export class CreateTeamDto {
  @ApiProperty({ description: 'Nome da equipe' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @ApiProperty({ description: 'Nome do capitão' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  captainName: string;

  @ApiProperty({ description: 'CPF do capitão' })
  @IsString()
  @IsNotEmpty()
  @Length(11, 14)
  captainCpf: string;

  @ApiProperty({ description: 'RG do capitão' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  captainRg: string;

  @ApiProperty({ description: 'Telefone do capitão' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  captainPhone: string;

  @ApiProperty({ description: 'Código do arrais do capitão' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  captainArraisCode: string;

  @ApiProperty({ 
    description: 'Componentes da equipe (máximo 2)',
    type: [CreateTeamMemberDto]
  })
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(2)
  @ValidateNested({ each: true })
  @Type(() => CreateTeamMemberDto)
  members: CreateTeamMemberDto[];
}

