import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Buoy } from '../../entities';
import { CreateBuoyDto } from './dto/create-buoy.dto';
import { UpdateBuoyDto } from './dto/update-buoy.dto';

@Injectable()
export class BuoysService {
  constructor(
    @InjectRepository(Buoy)
    private buoyRepository: Repository<Buoy>,
  ) {}

  async create(createBuoyDto: CreateBuoyDto): Promise<Buoy> {
    // Verificar se código já existe
    const existingBuoy = await this.buoyRepository.findOne({
      where: { code: createBuoyDto.code }
    });

    if (existingBuoy) {
      throw new ConflictException('Código da boia já está cadastrado');
    }

    const buoy = this.buoyRepository.create(createBuoyDto);
    return this.buoyRepository.save(buoy);
  }

  async findAll(): Promise<Buoy[]> {
    return this.buoyRepository.find({
      relations: ['assignments', 'assignments.team', 'assignments.inspector'],
      order: { createdAt: 'DESC' }
    });
  }

  async findActive(): Promise<Buoy[]> {
    return this.buoyRepository.find({
      where: { active: true },
      relations: ['assignments', 'assignments.team', 'assignments.inspector'],
      order: { code: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Buoy> {
    const buoy = await this.buoyRepository.findOne({
      where: { id },
      relations: ['assignments', 'assignments.team', 'assignments.inspector']
    });

    if (!buoy) {
      throw new NotFoundException(`Boia com ID ${id} não encontrada`);
    }

    return buoy;
  }

  async update(id: number, updateBuoyDto: UpdateBuoyDto): Promise<Buoy> {
    const buoy = await this.findOne(id);

    // Verificar se código já existe em outra boia
    if (updateBuoyDto.code && updateBuoyDto.code !== buoy.code) {
      const existingBuoy = await this.buoyRepository.findOne({
        where: { code: updateBuoyDto.code }
      });

      if (existingBuoy) {
        throw new ConflictException('Código da boia já está cadastrado');
      }
    }

    Object.assign(buoy, updateBuoyDto);
    return this.buoyRepository.save(buoy);
  }

  async remove(id: number): Promise<void> {
    const buoy = await this.findOne(id);
    await this.buoyRepository.remove(buoy);
  }

  async getBuoyStatus(): Promise<any[]> {
    const buoys = await this.buoyRepository
      .createQueryBuilder('buoy')
      .leftJoinAndSelect('buoy.assignments', 'assignment')
      .leftJoinAndSelect('assignment.team', 'team')
      .leftJoinAndSelect('assignment.inspector', 'inspector')
      .orderBy('buoy.code', 'ASC')
      .getMany();

    return buoys.map(buoy => {
      const latestAssignment = buoy.assignments
        .sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime())[0];

      return {
        id: buoy.id,
        code: buoy.code,
        description: buoy.description,
        location: buoy.location,
        active: buoy.active,
        currentAssignment: latestAssignment || null,
        totalAssignments: buoy.assignments.length
      };
    });
  }
}

