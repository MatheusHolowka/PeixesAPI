import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BuoysService } from './buoys.service';
import { CreateBuoyDto } from './dto/create-buoy.dto';
import { UpdateBuoyDto } from './dto/update-buoy.dto';

@ApiTags('buoys')
@Controller('buoys')
export class BuoysController {
  constructor(private readonly buoysService: BuoysService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova boia' })
  @ApiResponse({ status: 201, description: 'Boia criada com sucesso' })
  @ApiResponse({ status: 409, description: 'Código da boia já está cadastrado' })
  create(@Body() createBuoyDto: CreateBuoyDto) {
    return this.buoysService.create(createBuoyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as boias' })
  @ApiResponse({ status: 200, description: 'Lista de boias retornada com sucesso' })
  findAll() {
    return this.buoysService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Listar boias ativas' })
  @ApiResponse({ status: 200, description: 'Lista de boias ativas retornada com sucesso' })
  findActive() {
    return this.buoysService.findActive();
  }

  @Get('status')
  @ApiOperation({ summary: 'Obter status de ocupação das boias' })
  @ApiResponse({ status: 200, description: 'Status das boias retornado com sucesso' })
  getBuoyStatus() {
    return this.buoysService.getBuoyStatus();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar boia por ID' })
  @ApiResponse({ status: 200, description: 'Boia encontrada' })
  @ApiResponse({ status: 404, description: 'Boia não encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.buoysService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar boia' })
  @ApiResponse({ status: 200, description: 'Boia atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Boia não encontrada' })
  @ApiResponse({ status: 409, description: 'Código da boia já está cadastrado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBuoyDto: UpdateBuoyDto) {
    return this.buoysService.update(id, updateBuoyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover boia' })
  @ApiResponse({ status: 200, description: 'Boia removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Boia não encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.buoysService.remove(id);
  }
}

