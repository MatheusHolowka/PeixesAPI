import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@ApiTags('teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova equipe' })
  @ApiResponse({ status: 201, description: 'Equipe criada com sucesso' })
  @ApiResponse({ status: 409, description: 'CPF do capitão já está cadastrado' })
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.create(createTeamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as equipes' })
  @ApiResponse({ status: 200, description: 'Lista de equipes retornada com sucesso' })
  findAll() {
    return this.teamsService.findAll();
  }

  @Get('ranking')
  @ApiOperation({ summary: 'Obter ranking das equipes por pontuação' })
  @ApiResponse({ status: 200, description: 'Ranking retornado com sucesso' })
  getTeamRanking() {
    return this.teamsService.getTeamRanking();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar equipe por ID' })
  @ApiResponse({ status: 200, description: 'Equipe encontrada' })
  @ApiResponse({ status: 404, description: 'Equipe não encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar equipe' })
  @ApiResponse({ status: 200, description: 'Equipe atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Equipe não encontrada' })
  @ApiResponse({ status: 409, description: 'CPF do capitão já está cadastrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(id, updateTeamDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover equipe' })
  @ApiResponse({ status: 200, description: 'Equipe removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Equipe não encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.teamsService.remove(id);
  }
}

