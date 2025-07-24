import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FishService } from './fish.service';
import { CreateFishSpeciesDto } from './dto/create-fish-species.dto';
import { UpdateFishSpeciesDto } from './dto/update-fish-species.dto';
import { CreateFishCatchDto } from './dto/create-fish-catch.dto';
import { UpdateFishCatchDto } from './dto/update-fish-catch.dto';

@ApiTags('fish')
@Controller('fish')
export class FishController {
  constructor(private readonly fishService: FishService) {}

  // Fish Species endpoints
  @Post('species')
  @ApiOperation({ summary: 'Criar nova espécie de peixe' })
  @ApiResponse({ status: 201, description: 'Espécie criada com sucesso' })
  @ApiResponse({ status: 409, description: 'Espécie já está cadastrada' })
  createSpecies(@Body() createFishSpeciesDto: CreateFishSpeciesDto) {
    return this.fishService.createSpecies(createFishSpeciesDto);
  }

  @Get('species')
  @ApiOperation({ summary: 'Listar todas as espécies de peixes' })
  @ApiResponse({ status: 200, description: 'Lista de espécies retornada com sucesso' })
  findAllSpecies() {
    return this.fishService.findAllSpecies();
  }

  @Get('species/:id')
  @ApiOperation({ summary: 'Buscar espécie por ID' })
  @ApiResponse({ status: 200, description: 'Espécie encontrada' })
  @ApiResponse({ status: 404, description: 'Espécie não encontrada' })
  findOneSpecies(@Param('id', ParseIntPipe) id: number) {
    return this.fishService.findOneSpecies(id);
  }

  @Patch('species/:id')
  @ApiOperation({ summary: 'Atualizar espécie' })
  @ApiResponse({ status: 200, description: 'Espécie atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Espécie não encontrada' })
  @ApiResponse({ status: 409, description: 'Espécie já está cadastrada' })
  updateSpecies(@Param('id', ParseIntPipe) id: number, @Body() updateFishSpeciesDto: UpdateFishSpeciesDto) {
    return this.fishService.updateSpecies(id, updateFishSpeciesDto);
  }

  @Delete('species/:id')
  @ApiOperation({ summary: 'Remover espécie' })
  @ApiResponse({ status: 200, description: 'Espécie removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Espécie não encontrada' })
  removeSpecies(@Param('id', ParseIntPipe) id: number) {
    return this.fishService.removeSpecies(id);
  }

  // Fish Catch endpoints
  @Post('catches')
  @ApiOperation({ summary: 'Registrar nova captura de peixe' })
  @ApiResponse({ status: 201, description: 'Captura registrada com sucesso' })
  @ApiResponse({ status: 400, description: 'Peixe não atende ao tamanho mínimo' })
  @ApiResponse({ status: 404, description: 'Equipe, espécie ou fiscal não encontrado' })
  createCatch(@Body() createFishCatchDto: CreateFishCatchDto) {
    return this.fishService.createCatch(createFishCatchDto);
  }

  @Get('catches')
  @ApiOperation({ summary: 'Listar todas as capturas' })
  @ApiResponse({ status: 200, description: 'Lista de capturas retornada com sucesso' })
  findAllCatches() {
    return this.fishService.findAllCatches();
  }

  @Get('catches/statistics')
  @ApiOperation({ summary: 'Obter estatísticas das capturas' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas com sucesso' })
  getCatchStatistics() {
    return this.fishService.getCatchStatistics();
  }

  @Get('catches/:id')
  @ApiOperation({ summary: 'Buscar captura por ID' })
  @ApiResponse({ status: 200, description: 'Captura encontrada' })
  @ApiResponse({ status: 404, description: 'Captura não encontrada' })
  findOneCatch(@Param('id', ParseIntPipe) id: number) {
    return this.fishService.findOneCatch(id);
  }

  @Patch('catches/:id')
  @ApiOperation({ summary: 'Atualizar captura' })
  @ApiResponse({ status: 200, description: 'Captura atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Captura não encontrada' })
  @ApiResponse({ status: 400, description: 'Peixe não atende ao tamanho mínimo' })
  updateCatch(@Param('id', ParseIntPipe) id: number, @Body() updateFishCatchDto: UpdateFishCatchDto) {
    return this.fishService.updateCatch(id, updateFishCatchDto);
  }

  @Delete('catches/:id')
  @ApiOperation({ summary: 'Remover captura' })
  @ApiResponse({ status: 200, description: 'Captura removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Captura não encontrada' })
  removeCatch(@Param('id', ParseIntPipe) id: number) {
    return this.fishService.removeCatch(id);
  }
}

