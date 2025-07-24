import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BuoyAssignment } from './buoy-assignment.entity';

@Entity('buoys')
export class Buoy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ length: 200, nullable: true })
  description: string;

  @Column({ length: 200, nullable: true })
  location: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => BuoyAssignment, buoyAssignment => buoyAssignment.buoy)
  assignments: BuoyAssignment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

