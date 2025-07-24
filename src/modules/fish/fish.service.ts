import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FishSpecies, FishCatch, Team, Inspector } from '../../entities';
import { CreateFishSpeciesDto } from './dto/create-fish-species.dto';
import { UpdateFishSpeciesDto } from './dto/update-fish-species.dto';
import { CreateFishCatchDto } from './dto/create-fish-catch.dto';
import { UpdateFishCatchDto } from './dto/update-fish-catch.dto';

@Injectable()
export class FishService {
  constructor(
    @InjectRepository(FishSpecies)
    private fishSpeciesRepository: Repository<FishSpecies>,
    @InjectRepository(FishCatch)
    private fishCatchRepository: Repository<FishCatch>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(Inspector)
    private inspectorRepository: Repository<Inspector>,
  ) {}

  // Fish Species methods
  async createSpecies(createFishSpeciesDto: CreateFishSpeciesDto): Promise<FishSpecies> {
    // Verificar se nome já existe
    const existingSpecies = await this.fishSpeciesRepository.findOne({
      where: { name: createFishSpeciesDto.name }
    });

    if (existingSpecies) {
      throw new ConflictException('Espécie de peixe já está cadastrada');
    }

    const fishSpecies = this.fishSpeciesRepository.create(createFishSpeciesDto);
    return this.fishSpeciesRepository.save(fishSpecies);
  }

  async findAllSpecies(): Promise<FishSpecies[]> {
    return this.fishSpeciesRepository.find({
      relations: ['catches'],
      order: { name: 'ASC' }
    });
  }

  async findOneSpecies(id: number): Promise<FishSpecies> {
    const fishSpecies = await this.fishSpeciesRepository.findOne({
      where: { id },
      relations: ['catches', 'catches.team']
    });

    if (!fishSpecies) {
      throw new NotFoundException(`Espécie de peixe com ID ${id} não encontrada`);
    }

    return fishSpecies;
  }

  async updateSpecies(id: number, updateFishSpeciesDto: UpdateFishSpeciesDto): Promise<FishSpecies> {
    const fishSpecies = await this.findOneSpecies(id);

    // Verificar se nome já existe em outra espécie
    if (updateFishSpeciesDto.name && updateFishSpeciesDto.name !== fishSpecies.name) {
      const existingSpecies = await this.fishSpeciesRepository.findOne({
        where: { name: updateFishSpeciesDto.name }
      });

      if (existingSpecies) {
        throw new ConflictException('Espécie de peixe já está cadastrada');
      }
    }

    Object.assign(fishSpecies, updateFishSpeciesDto);
    return this.fishSpeciesRepository.save(fishSpecies);
  }

  async removeSpecies(id: number): Promise<void> {
    const fishSpecies = await this.findOneSpecies(id);
    await this.fishSpeciesRepository.remove(fishSpecies);
  }

  // Fish Catch methods
  async createCatch(createFishCatchDto: CreateFishCatchDto): Promise<FishCatch> {
    // Verificar se equipe existe
    const team = await this.teamRepository.findOne({
      where: { id: createFishCatchDto.teamId }
    });

    if (!team) {
      throw new NotFoundException('Equipe não encontrada');
    }

    // Verificar se espécie existe
    const fishSpecies = await this.fishSpeciesRepository.findOne({
      where: { id: createFishCatchDto.fishSpeciesId }
    });

    if (!fishSpecies) {
      throw new NotFoundException('Espécie de peixe não encontrada');
    }

    // Verificar se fiscal existe (se fornecido)
    if (createFishCatchDto.inspectorId) {
      const inspector = await this.inspectorRepository.findOne({
        where: { id: createFishCatchDto.inspectorId }
      });

      if (!inspector) {
        throw new NotFoundException('Fiscal não encontrado');
      }
    }

    // Verificar tamanho mínimo
    if (createFishCatchDto.sizeCm < fishSpecies.minimumSize) {
      throw new BadRequestException(
        `Peixe não atende ao tamanho mínimo de ${fishSpecies.minimumSize}cm para a espécie ${fishSpecies.name}`
      );
    }

    // Calcular pontuação
    const calculatedPoints = createFishCatchDto.sizeCm * fishSpecies.pointsPerCm;

    const fishCatch = this.fishCatchRepository.create({
      ...createFishCatchDto,
      calculatedPoints,
      caughtAt: createFishCatchDto.caughtAt ? new Date(createFishCatchDto.caughtAt) : new Date(),
    });

    return this.fishCatchRepository.save(fishCatch);
  }

  async findAllCatches(): Promise<FishCatch[]> {
    return this.fishCatchRepository.find({
      relations: ['team', 'fishSpecies', 'inspector'],
      order: { caughtAt: 'DESC' }
    });
  }

  async findOneCatch(id: number): Promise<FishCatch> {
    const fishCatch = await this.fishCatchRepository.findOne({
      where: { id },
      relations: ['team', 'fishSpecies', 'inspector']
    });

    if (!fishCatch) {
      throw new NotFoundException(`Captura de peixe com ID ${id} não encontrada`);
    }

    return fishCatch;
  }

  async updateCatch(id: number, updateFishCatchDto: UpdateFishCatchDto): Promise<FishCatch> {
    const fishCatch = await this.findOneCatch(id);

    // Se mudou a espécie ou tamanho, recalcular pontuação
    if (updateFishCatchDto.fishSpeciesId || updateFishCatchDto.sizeCm) {
      const fishSpeciesId = updateFishCatchDto.fishSpeciesId || fishCatch.fishSpeciesId;
      const sizeCm = updateFishCatchDto.sizeCm || fishCatch.sizeCm;

      const fishSpecies = await this.fishSpeciesRepository.findOne({
        where: { id: fishSpeciesId }
      });

      if (!fishSpecies) {
        throw new NotFoundException('Espécie de peixe não encontrada');
      }

      // Verificar tamanho mínimo
      if (sizeCm < fishSpecies.minimumSize) {
        throw new BadRequestException(
          `Peixe não atende ao tamanho mínimo de ${fishSpecies.minimumSize}cm para a espécie ${fishSpecies.name}`
        );
      }

      fishCatch.calculatedPoints = sizeCm * fishSpecies.pointsPerCm;
    }

    Object.assign(fishCatch, updateFishCatchDto);
    return this.fishCatchRepository.save(fishCatch);
  }

  async removeCatch(id: number): Promise<void> {
    const fishCatch = await this.findOneCatch(id);
    await this.fishCatchRepository.remove(fishCatch);
  }

  async getCatchStatistics(): Promise<any> {
    const totalCatches = await this.fishCatchRepository.count({ where: { valid: true } });
    
    const speciesStats = await this.fishCatchRepository
      .createQueryBuilder('catch')
      .leftJoinAndSelect('catch.fishSpecies', 'species')
      .where('catch.valid = :valid', { valid: true })
      .groupBy('catch.fishSpeciesId')
      .select([
        'species.name as speciesName',
        'COUNT(catch.id) as totalCatches',
        'AVG(catch.sizeCm) as averageSize',
        'MAX(catch.sizeCm) as maxSize',
        'SUM(catch.calculatedPoints) as totalPoints'
      ])
      .getRawMany();

    const teamStats = await this.fishCatchRepository
      .createQueryBuilder('catch')
      .leftJoinAndSelect('catch.team', 'team')
      .where('catch.valid = :valid', { valid: true })
      .groupBy('catch.teamId')
      .select([
        'team.name as teamName',
        'COUNT(catch.id) as totalCatches',
        'SUM(catch.calculatedPoints) as totalPoints'
      ])
      .getRawMany();

    return {
      totalCatches,
      speciesStats,
      teamStats
    };
  }
}

