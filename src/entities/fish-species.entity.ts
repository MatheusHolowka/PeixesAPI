import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { FishCatch } from './fish-catch.entity';

@Entity('fish_species')
export class FishSpecies {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  pointsPerCm: number;

  @Column({ name: 'minimum_size', type: 'decimal', precision: 5, scale: 2, default: 0 })
  minimumSize: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => FishCatch, fishCatch => fishCatch.fishSpecies)
  catches: FishCatch[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

