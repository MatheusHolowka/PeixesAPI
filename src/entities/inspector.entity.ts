import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BuoyAssignment } from './buoy-assignment.entity';
import { FishCatch } from './fish-catch.entity';

@Entity('inspectors')
export class Inspector {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @OneToMany(() => BuoyAssignment, buoyAssignment => buoyAssignment.inspector)
  buoyAssignments: BuoyAssignment[];

  @OneToMany(() => FishCatch, fishCatch => fishCatch.inspector)
  fishCatches: FishCatch[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

