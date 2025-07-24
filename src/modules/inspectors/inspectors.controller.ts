import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InspectorsService } from './inspectors.service';
import { CreateInspectorDto } from './dto/create-inspector.dto';
import { UpdateInspectorDto } from './dto/update-inspector.dto';

@ApiTags('inspectors')
@Controller('inspectors')
export class InspectorsController {
  constructor(private readonly inspectorsService: InspectorsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo fiscal' })
  @ApiResponse({ status: 201, description: 'Fiscal criado com sucesso' })
  create(@Body() createInspectorDto: CreateInspectorDto) {
    return this.inspectorsService.create(createInspectorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os fiscais' })
  @ApiResponse({ status: 200, description: 'Lista de fiscais retornada com sucesso' })
  findAll() {
    return this.inspectorsService.findAll();
  }

  @Get('activity')
  @ApiOperation({ summary: 'Obter relatório de atividades dos fiscais' })
  @ApiResponse({ status: 200, description: 'Relatório de atividades retornado com sucesso' })
  getInspectorActivity() {
    return this.inspectorsService.getInspectorActivity();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar fiscal por ID' })
  @ApiResponse({ status: 200, description: 'Fiscal encontrado' })
  @ApiResponse({ status: 404, description: 'Fiscal não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inspectorsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar fiscal' })
  @ApiResponse({ status: 200, description: 'Fiscal atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Fiscal não encontrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateInspectorDto: UpdateInspectorDto) {
    return this.inspectorsService.update(id, updateInspectorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover fiscal' })
  @ApiResponse({ status: 200, description: 'Fiscal removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Fiscal não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inspectorsService.remove(id);
  }
}

