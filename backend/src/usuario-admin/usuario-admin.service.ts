import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../users/usuario.entity';
import * as bcrypt from 'bcrypt';

interface CreateUsuarioDto {
  nombre: string;
  correo: string;
  password: string;
  rol?: 'ADMIN' | 'CAPTURISTA';
  estatus?: 'ACTIVO' | 'INACTIVO';
}

interface UpdateUsuarioDto {
  nombre?: string;
  correo?: string;
  password?: string;
  rol?: 'ADMIN' | 'CAPTURISTA';
  estatus?: 'ACTIVO' | 'INACTIVO';
}

@Injectable()
export class UsuariosAdminService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async findAll() {
    return this.usuarioRepo.find({ 
      order: { idUsuario: 'DESC' },
      select: ['idUsuario', 'nombre', 'correo', 'rol', 'estatus']
    });
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepo.findOne({
      where: { idUsuario: id },
      select: ['idUsuario', 'nombre', 'correo', 'rol', 'estatus']
    });
    if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);
    return usuario;
  }

  async create(data: CreateUsuarioDto) {
    const { nombre, correo, password, rol, estatus } = data;

    if (!nombre || !correo || !password) {
      throw new Error('Faltan campos obligatorios');
    }

    const existe = await this.usuarioRepo.findOne({ where: { correo } });
    if (existe) throw new ConflictException('El correo ya está registrado');

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = this.usuarioRepo.create({
      nombre,
      correo,
      passwordHash,
      rol: rol || 'CAPTURISTA',
      estatus: estatus || 'ACTIVO',
    });

    return this.usuarioRepo.save(usuario);
  }

  async update(id: number, data: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepo.findOne({
      where: { idUsuario: id },
    });
    if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);

    const actualizacion: any = {};
    
    if (data.nombre) actualizacion.nombre = data.nombre;
    if (data.correo) actualizacion.correo = data.correo;
    if (data.rol) actualizacion.rol = data.rol;
    if (data.estatus) actualizacion.estatus = data.estatus;

    if (data.password) {
      actualizacion.passwordHash = await bcrypt.hash(data.password, 10);
    }

    await this.usuarioRepo.update({ idUsuario: id }, actualizacion);
    return this.findOne(id);
  }

  async toggleEstatus(id: number) {
    const usuario = await this.usuarioRepo.findOne({
      where: { idUsuario: id },
    });
    if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);
    
    const nuevoEstatus = usuario.estatus === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    await this.usuarioRepo.update({ idUsuario: id }, { estatus: nuevoEstatus });
    return this.findOne(id);
  }

  async remove(id: number) {
    const usuario = await this.usuarioRepo.findOne({
      where: { idUsuario: id },
    });
    if (!usuario) throw new NotFoundException(`Usuario ${id} no encontrado`);
    
    await this.usuarioRepo.delete({ idUsuario: id });
    return { ok: true, message: `Usuario ${id} eliminado correctamente` };
  }
}