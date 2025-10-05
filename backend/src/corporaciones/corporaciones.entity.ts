import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('corporaciones')
export class Corporacion {
  @PrimaryGeneratedColumn()
  id_corporacion: number;

  @Column({ length: 150, unique: true })
  nombre_corporacion: string;

  @Column({ length: 20, default: 'ACTIVO' })
  estatus: string;
}