import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Evento } from '../eventos/evento.entity';
import { Corporacion } from '../corporaciones/corporaciones.entity';
import { Motivo } from '../motivos/motivos.entity';
import { Usuario } from '../users/usuario.entity';
import { Evidencia } from '../evidencias/evidencias.entity';

@Entity('incidencias')
export class Incidencia {
  @PrimaryGeneratedColumn()
  id_incidencia: number;

  @Column()
  id_evento: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'time' })
  hora: string;

  @Column()
  id_corporacion: number;

  @Column()
  id_motivo: number;

  @Column({ length: 255 })
  ubicacion: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column()
  usuario_crea: number;

  @Column({ nullable: true })
  usuario_cierra: number;

  @Column({ type: 'timestamp', nullable: true })
  fecha_cierre: Date;

  @Column({ length: 20, default: 'ABIERTA' })
  estatus: string;

  // Relaciones
  @ManyToOne(() => Evento)
  @JoinColumn({ name: 'id_evento' })
  evento: Evento;

  @ManyToOne(() => Corporacion)
  @JoinColumn({ name: 'id_corporacion' })
  corporacion: Corporacion;

  @ManyToOne(() => Motivo)
  @JoinColumn({ name: 'id_motivo' })
  motivo: Motivo;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_crea' })
  usuarioCrea: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_cierra' })
  usuarioCierra: Usuario;

  @OneToMany(() => Evidencia, (evidencia) => evidencia.incidencia)
  evidencias: Evidencia[];
}