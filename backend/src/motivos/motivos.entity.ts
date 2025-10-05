import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('motivos')
export class Motivo {
  @PrimaryGeneratedColumn()
  id_motivo: number;

  @Column({ length: 150, unique: true })
  nombre_motivo: string;

  @Column({ length: 20, default: 'ACTIVO' })
  estatus: string;
}