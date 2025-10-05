import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Incidencia } from '../incidencias/incidencias.entity';
import { Usuario } from '../users/usuario.entity';

@Entity('evidencias')
export class Evidencia {
  @PrimaryGeneratedColumn()
  id_evidencia: number;

  @Column()
  id_incidencia: number;

  @Column()
  usuario_subio: number;

  @Column({ length: 255 })
  ruta_archivo: string;

  @Column({ length: 10 })
  tipo_archivo: string; // 'JPG', 'PNG', 'PDF'

  @CreateDateColumn({ type: 'timestamp', default: () => 'NOW()' })
  fecha_subida: Date;

  // Relaciones
  @ManyToOne(() => Incidencia, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id_incidencia' })
  incidencia: Incidencia;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_subio' })
  usuarioSubio: Usuario;
}