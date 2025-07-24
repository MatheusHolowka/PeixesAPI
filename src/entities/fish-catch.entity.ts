import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Team } from './team.entity';
import { FishSpecies } from './fish-species.entity';
import { Inspector } from './inspector.entity';

@Entity('fish_catches')
export class FishCatch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'team_id' })
  teamId: number;

  @Column({ name: 'fish_species_id' })
  fishSpeciesId: number;

  @Column({ name: 'inspector_id', nullable: true })
  inspectorId: number;

  @Column({ name: 'size_cm', type: 'decimal', precision: 5, scale: 2 })
  sizeCm: number;

  @Column({ name: 'calculated_points', type: 'decimal', precision: 8, scale: 2 })
  calculatedPoints: number;

  @Column({ name: 'caught_at', type: 'datetime' })
  caughtAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: true })
  valid: boolean;

  @ManyToOne(() => Team, team => team.fishCatches, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @ManyToOne(() => FishSpecies, fishSpecies => fishSpecies.catches, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fish_species_id' })
  fishSpecies: FishSpecies;

  @ManyToOne(() => Inspector, inspector => inspector.fishCatches, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'inspector_id' })
  inspector: Inspector;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

