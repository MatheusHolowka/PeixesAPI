import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TeamMember } from './team-member.entity';
import { BuoyAssignment } from './buoy-assignment.entity';
import { FishCatch } from './fish-catch.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  // Dados do Capitão
  @Column({ name: 'captain_name', length: 100 })
  captainName: string;

  @Column({ name: 'captain_cpf', length: 14, unique: true })
  captainCpf: string;

  @Column({ name: 'captain_rg', length: 20 })
  captainRg: string;

  @Column({ name: 'captain_phone', length: 20 })
  captainPhone: string;

  @Column({ name: 'captain_arrais_code', length: 50 })
  captainArraisCode: string;

  @OneToMany(() => TeamMember, teamMember => teamMember.team, { cascade: true })
  members: TeamMember[];

  @OneToMany(() => BuoyAssignment, buoyAssignment => buoyAssignment.team)
  buoyAssignments: BuoyAssignment[];

  @OneToMany(() => FishCatch, fishCatch => fishCatch.team)
  fishCatches: FishCatch[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

