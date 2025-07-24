import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LaunchesService } from './launches.service';
import { CreateBuoyAssignmentDto } from './dto/create-buoy-assignment.dto';
import { UpdateBuoyAssignmentDto } from './dto/update-buoy-assignment.dto';

@ApiTags('launches')
@Controller('launches')
export class LaunchesController {
  constructor(private readonly launchesService: LaunchesService) {}

  @Post('buoy-assignments')
  @ApiOperation({ summary: 'Criar nova atribuição de boia' })
  @ApiResponse({ status: 201, description: 'Atribuição criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou boia inativa' })
  @ApiResponse({ status: 404, description: 'Boia, equipe ou fiscal não encontrado' })
  createAssignment(@Body() createBuoyAssignmentDto: CreateBuoyAssignmentDto) {
    return this.launchesService.createAssignment(createBuoyAssignmentDto);
  }

  @Get('buoy-assignments')
  @ApiOperation({ summary: 'Listar todas as atribuições de boias' })
  @ApiResponse({ status: 200, description: 'Lista de atribuições retornada com sucesso' })
  @ApiQuery({ name: 'teamId', required: false, description: 'Filtrar por ID da equipe' })
  @ApiQuery({ name: 'inspectorId', required: false, description: 'Filtrar por ID do fiscal' })
  @ApiQuery({ name: 'buoyId', required: false, description: 'Filtrar por ID da boia' })
  findAllAssignments(
    @Query('teamId') teamId?: string,
    @Query('inspectorId') inspectorId?: string,
    @Query('buoyId') buoyId?: string,
  ) {
    if (teamId) {
      return this.launchesService.findByTeam(parseInt(teamId));
    }
    if (inspectorId) {
      return this.launchesService.findByInspector(parseInt(inspectorId));
    }
    if (buoyId) {
      return this.launchesService.findByBuoy(parseInt(buoyId));
    }
    return this.launchesService.findAll();
  }

  @Get('buoy-assignments/summary')
  @ApiOperation({ summary: 'Obter resumo das atribuições de boias' })
  @ApiResponse({ status: 200, description: 'Resumo retornado com sucesso' })
  getAssignmentSummary() {
    return this.launchesService.getAssignmentSummary();
  }

  @Get('buoy-assignments/:id')
  @ApiOperation({ summary: 'Buscar atribuição por ID' })
  @ApiResponse({ status: 200, description: 'Atribuição encontrada' })
  @ApiResponse({ status: 404, description: 'Atribuição não encontrada' })
  findOneAssignment(@Param('id', ParseIntPipe) id: number) {
    return this.launchesService.findOne(id);
  }

  @Patch('buoy-assignments/:id')
  @ApiOperation({ summary: 'Atualizar atribuição' })
  @ApiResponse({ status: 200, description: 'Atribuição atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Atribuição não encontrada' })
  updateAssignment(@Param('id', ParseIntPipe) id: number, @Body() updateBuoyAssignmentDto: UpdateBuoyAssignmentDto) {
    return this.launchesService.update(id, updateBuoyAssignmentDto);
  }

  @Delete('buoy-assignments/:id')
  @ApiOperation({ summary: 'Remover atribuição' })
  @ApiResponse({ status: 200, description: 'Atribuição removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Atribuição não encontrada' })
  removeAssignment(@Param('id', ParseIntPipe) id: number) {
    return this.launchesService.remove(id);
  }
}

