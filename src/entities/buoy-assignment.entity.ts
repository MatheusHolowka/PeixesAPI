import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Team } from './team.entity';
import { Buoy } from './buoy.entity';
import { Inspector } from './inspector.entity';

export enum AssignmentType {
  TEAM = 'team',
  INSPECTOR = 'inspector'
}

@Entity('buoy_assignments')
export class BuoyAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'buoy_id' })
  buoyId: number;

  @Column({ name: 'team_id', nullable: true })
  teamId: number;

  @Column({ name: 'inspector_id', nullable: true })
  inspectorId: number;

  @Column({ 
    type: 'enum', 
    enum: AssignmentType,
    name: 'assignment_type'
  })
  assignmentType: AssignmentType;

  @Column({ name: 'assigned_at', type: 'datetime' })
  assignedAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Buoy, buoy => buoy.assignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'buoy_id' })
  buoy: Buoy;

  @ManyToOne(() => Team, team => team.buoyAssignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @ManyToOne(() => Inspector, inspector => inspector.buoyAssignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inspector_id' })
  inspector: Inspector;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

