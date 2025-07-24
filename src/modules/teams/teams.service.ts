import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team, TeamMember } from '../../entities';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(TeamMember)
    private teamMemberRepository: Repository<TeamMember>,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    // Verificar se CPF já existe
    const existingTeam = await this.teamRepository.findOne({
      where: { captainCpf: createTeamDto.captainCpf }
    });

    if (existingTeam) {
      throw new ConflictException('CPF do capitão já está cadastrado');
    }

    // Criar equipe
    const team = this.teamRepository.create({
      name: createTeamDto.name,
      captainName: createTeamDto.captainName,
      captainCpf: createTeamDto.captainCpf,
      captainRg: createTeamDto.captainRg,
      captainPhone: createTeamDto.captainPhone,
      captainArraisCode: createTeamDto.captainArraisCode,
    });

    const savedTeam = await this.teamRepository.save(team);

    // Criar membros da equipe
    if (createTeamDto.members && createTeamDto.members.length > 0) {
      const members = createTeamDto.members.map(memberDto => 
        this.teamMemberRepository.create({
          ...memberDto,
          teamId: savedTeam.id,
        })
      );
      await this.teamMemberRepository.save(members);
    }

    return this.findOne(savedTeam.id);
  }

  async findAll(): Promise<Team[]> {
    return this.teamRepository.find({
      relations: ['members'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: ['members']
    });

    if (!team) {
      throw new NotFoundException(`Equipe com ID ${id} não encontrada`);
    }

    return team;
  }

  async update(id: number, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.findOne(id);

    // Verificar se CPF já existe em outra equipe
    if (updateTeamDto.captainCpf && updateTeamDto.captainCpf !== team.captainCpf) {
      const existingTeam = await this.teamRepository.findOne({
        where: { captainCpf: updateTeamDto.captainCpf }
      });

      if (existingTeam) {
        throw new ConflictException('CPF do capitão já está cadastrado');
      }
    }

    // Atualizar dados da equipe
    Object.assign(team, updateTeamDto);
    const updatedTeam = await this.teamRepository.save(team);

    // Atualizar membros se fornecidos
    if (updateTeamDto.members) {
      // Remover membros existentes
      await this.teamMemberRepository.delete({ teamId: id });

      // Criar novos membros
      if (updateTeamDto.members.length > 0) {
        const members = updateTeamDto.members.map(memberDto => 
          this.teamMemberRepository.create({
            ...memberDto,
            teamId: id,
          })
        );
        await this.teamMemberRepository.save(members);
      }
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const team = await this.findOne(id);
    await this.teamRepository.remove(team);
  }

  async getTeamRanking(): Promise<any[]> {
    const teams = await this.teamRepository
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.fishCatches', 'catch')
      .leftJoinAndSelect('catch.fishSpecies', 'species')
      .leftJoinAndSelect('team.members', 'members')
      .getMany();

    return teams.map(team => {
      const totalPoints = team.fishCatches
        .filter(catch_ => catch_.valid)
        .reduce((sum, catch_) => sum + Number(catch_.calculatedPoints), 0);

      const totalFish = team.fishCatches.filter(catch_ => catch_.valid).length;

      return {
        id: team.id,
        name: team.name,
        captainName: team.captainName,
        totalPoints,
        totalFish,
        members: team.members,
        catches: team.fishCatches.filter(catch_ => catch_.valid)
      };
    }).sort((a, b) => b.totalPoints - a.totalPoints);
  }
}

