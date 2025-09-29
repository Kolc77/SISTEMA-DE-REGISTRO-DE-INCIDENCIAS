import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  idUsuario: number;

  @Column({ name: 'nombre', type: 'varchar', length: 150 })
  nombre: string;

  @Column({ name: 'correo', type: 'varchar', length: 150, unique: true })
  correo: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ name: 'rol', type: 'varchar', length: 20 })
  rol: 'ADMIN' | 'USER';

  @Column({ name: 'estatus', type: 'varchar', length: 20, default: 'ACTIVO' })
  estatus: 'ACTIVO' | 'INACTIVO';
}
