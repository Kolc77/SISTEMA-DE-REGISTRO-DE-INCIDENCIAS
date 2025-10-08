import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuarios_admin')
export class UsuarioAdmin {
  @PrimaryGeneratedColumn()
  id_usuario_admin: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ unique: true, length: 100 })
  correo: string;

  @Column({ select: false })
  password_hash: string;

  @Column({ type: 'enum', enum: ['ADMIN', 'CAPTURISTA'], default: 'CAPTURISTA' })
  rol: string;

  @Column({ type: 'enum', enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' })
  estatus: string;
}
