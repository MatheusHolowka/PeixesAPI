import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuoyAssignment, AssignmentType, Buoy, Team, Inspector } from '../../entities';
import { CreateBuoyAssignmentDto } from './dto/create-buoy-assignment.dto';
import { UpdateBuoyAssignmentDto } from './dto/update-buoy-assignment.dto';

@Injectable()
export class LaunchesService {
  constructor(
    @InjectRepository(BuoyAssignment)
    private buoyAssignmentRepository: Repository<BuoyAssignment>,
    @InjectRepository(Buoy)
    private buoyRepository: Repository<Buoy>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(Inspector)
    private inspectorRepository: Repository<Inspector>,
  ) {}

  async createAssignment(createBuoyAssignmentDto: CreateBuoyAssignmentDto): Promise<BuoyAssignment> {
    // Verificar se boia existe e está ativa
    const buoy = await this.buoyRepository.findOne({
      where: { id: createBuoyAssignmentDto.buoyId }
    });

    if (!buoy) {
      throw new NotFoundException('Boia não encontrada');
    }

    if (!buoy.active) {
      throw new BadRequestException('Boia não está ativa');
    }

    // Validar tipo de atribuição
    if (createBuoyAssignmentDto.assignmentType === AssignmentType.TEAM) {
      if (!createBuoyAssignmentDto.teamId) {
        throw new BadRequestException('ID da equipe é obrigatório para atribuição por equipe');
      }

      const team = await this.teamRepository.findOne({
        where: { id: createBuoyAssignmentDto.teamId }
      });

      if (!team) {
        throw new NotFoundException('Equipe não encontrada');
      }
    } else if (createBuoyAssignmentDto.assignmentType === AssignmentType.INSPECTOR) {
      if (!createBuoyAssignmentDto.inspectorId) {
        throw new BadRequestException('ID do fiscal é obrigatório para atribuição por fiscal');
      }

      const inspector = await this.inspectorRepository.findOne({
        where: { id: createBuoyAssignmentDto.inspectorId }
      });

      if (!inspector) {
        throw new NotFoundException('Fiscal não encontrado');
      }
    }

    const buoyAssignment = this.buoyAssignmentRepository.create({
      ...createBuoyAssignmentDto,
      assignedAt: createBuoyAssignmentDto.assignedAt ? new Date(createBuoyAssignmentDto.assignedAt) : new Date(),
    });

    return this.buoyAssignmentRepository.save(buoyAssignment);
  }

  async findAll(): Promise<BuoyAssignment[]> {
    return this.buoyAssignmentRepository.find({
      relations: ['buoy', 'team', 'inspector'],
      order: { assignedAt: 'DESC' }
    });
  }

  async findByTeam(teamId: number): Promise<BuoyAssignment[]> {
    return this.buoyAssignmentRepository.find({
      where: { teamId, assignmentType: AssignmentType.TEAM },
      relations: ['buoy', 'team'],
      order: { assignedAt: 'DESC' }
    });
  }

  async findByInspector(inspectorId: number): Promise<BuoyAssignment[]> {
    return this.buoyAssignmentRepository.find({
      where: { inspectorId, assignmentType: AssignmentType.INSPECTOR },
      relations: ['buoy', 'inspector'],
      order: { assignedAt: 'DESC' }
    });
  }

  async findByBuoy(buoyId: number): Promise<BuoyAssignment[]> {
    return this.buoyAssignmentRepository.find({
      where: { buoyId },
      relations: ['buoy', 'team', 'inspector'],
      order: { assignedAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<BuoyAssignment> {
    const buoyAssignment = await this.buoyAssignmentRepository.findOne({
      where: { id },
      relations: ['buoy', 'team', 'inspector']
    });

    if (!buoyAssignment) {
      throw new NotFoundException(`Atribuição de boia com ID ${id} não encontrada`);
    }

    return buoyAssignment;
  }

  async update(id: number, updateBuoyAssignmentDto: UpdateBuoyAssignmentDto): Promise<BuoyAssignment> {
    const buoyAssignment = await this.findOne(id);

    // Validações similares ao create se necessário
    if (updateBuoyAssignmentDto.assignmentType === AssignmentType.TEAM && updateBuoyAssignmentDto.teamId) {
      const team = await this.teamRepository.findOne({
        where: { id: updateBuoyAssignmentDto.teamId }
      });

      if (!team) {
        throw new NotFoundException('Equipe não encontrada');
      }
    }

    if (updateBuoyAssignmentDto.assignmentType === AssignmentType.INSPECTOR && updateBuoyAssignmentDto.inspectorId) {
      const inspector = await this.inspectorRepository.findOne({
        where: { id: updateBuoyAssignmentDto.inspectorId }
      });

      if (!inspector) {
        throw new NotFoundException('Fiscal não encontrado');
      }
    }

    Object.assign(buoyAssignment, updateBuoyAssignmentDto);
    return this.buoyAssignmentRepository.save(buoyAssignment);
  }

  async remove(id: number): Promise<void> {
    const buoyAssignment = await this.findOne(id);
    await this.buoyAssignmentRepository.remove(buoyAssignment);
  }

  async getAssignmentSummary(): Promise<any> {
    const totalAssignments = await this.buoyAssignmentRepository.count();
    
    const teamAssignments = await this.buoyAssignmentRepository.count({
      where: { assignmentType: AssignmentType.TEAM }
    });

    const inspectorAssignments = await this.buoyAssignmentRepository.count({
      where: { assignmentType: AssignmentType.INSPECTOR }
    });

    const buoyUsage = await this.buoyAssignmentRepository
      .createQueryBuilder('assignment')
      .leftJoinAndSelect('assignment.buoy', 'buoy')
      .groupBy('assignment.buoyId')
      .select([
        'buoy.code as buoyCode',
        'COUNT(assignment.id) as totalAssignments'
      ])
      .getRawMany();

    const recentAssignments = await this.buoyAssignmentRepository.find({
      relations: ['buoy', 'team', 'inspector'],
      order: { assignedAt: 'DESC' },
      take: 10
    });

    return {
      totalAssignments,
      teamAssignments,
      inspectorAssignments,
      buoyUsage,
      recentAssignments
    };
  }
}

