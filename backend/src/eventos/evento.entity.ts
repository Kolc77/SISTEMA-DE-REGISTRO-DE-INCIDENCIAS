import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('eventos')
export class Evento {
  @PrimaryGeneratedColumn()
  id_evento: number;

  @Column({ length: 150 })
  nombre_evento: string;

  @Column({ type: 'date' })
  fecha_inicio: Date;

  @Column({ type: 'date', nullable: true })
  fecha_fin: Date | null;

  @Column({ length: 255, nullable: true })
  ubicacion: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ length: 20, default: 'ACTIVO' })
  estatus: string;
}
