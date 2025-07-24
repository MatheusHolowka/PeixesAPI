import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inspector } from '../../entities';
import { CreateInspectorDto } from './dto/create-inspector.dto';
import { UpdateInspectorDto } from './dto/update-inspector.dto';

@Injectable()
export class InspectorsService {
  constructor(
    @InjectRepository(Inspector)
    private inspectorRepository: Repository<Inspector>,
  ) {}

  async create(createInspectorDto: CreateInspectorDto): Promise<Inspector> {
    const inspector = this.inspectorRepository.create(createInspectorDto);
    return this.inspectorRepository.save(inspector);
  }

  async findAll(): Promise<Inspector[]> {
    return this.inspectorRepository.find({
      relations: ['buoyAssignments', 'fishCatches'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Inspector> {
    const inspector = await this.inspectorRepository.findOne({
      where: { id },
      relations: ['buoyAssignments', 'fishCatches']
    });

    if (!inspector) {
      throw new NotFoundException(`Fiscal com ID ${id} não encontrado`);
    }

    return inspector;
  }

  async update(id: number, updateInspectorDto: UpdateInspectorDto): Promise<Inspector> {
    const inspector = await this.findOne(id);
    Object.assign(inspector, updateInspectorDto);
    return this.inspectorRepository.save(inspector);
  }

  async remove(id: number): Promise<void> {
    const inspector = await this.findOne(id);
    await this.inspectorRepository.remove(inspector);
  }

  async getInspectorActivity(): Promise<any[]> {
    const inspectors = await this.inspectorRepository
      .createQueryBuilder('inspector')
      .leftJoinAndSelect('inspector.buoyAssignments', 'buoyAssignment')
      .leftJoinAndSelect('buoyAssignment.buoy', 'buoy')
      .leftJoinAndSelect('inspector.fishCatches', 'fishCatch')
      .leftJoinAndSelect('fishCatch.team', 'team')
      .leftJoinAndSelect('fishCatch.fishSpecies', 'species')
      .orderBy('inspector.name', 'ASC')
      .getMany();

    return inspectors.map(inspector => ({
      id: inspector.id,
      name: inspector.name,
      buoyAssignments: inspector.buoyAssignments.length,
      fishCatchesValidated: inspector.fishCatches.length,
      recentActivity: [
        ...inspector.buoyAssignments.map(assignment => ({
          type: 'buoy_assignment',
          date: assignment.assignedAt,
          description: `Atribuição da boia ${assignment.buoy?.code}`
        })),
        ...inspector.fishCatches.map(catch_ => ({
          type: 'fish_validation',
          date: catch_.caughtAt,
          description: `Validação de peixe da equipe ${catch_.team?.name}`
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)
    }));
  }
}

