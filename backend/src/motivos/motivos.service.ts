import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Motivo } from './motivos.entity';

@Injectable()
export class MotivosService {
  constructor(
    @InjectRepository(Motivo)
    private readonly motivoRepo: Repository<Motivo>,
  ) {}

  // Obtener todos los motivos
  async findAll() {
    return this.motivoRepo.find({
      order: { nombre_motivo: 'ASC' },
    });
  }

  // Obtener solo motivos activos
  async findActivos() {
    return this.motivoRepo.find({
      where: { estatus: 'ACTIVO' },
      order: { nombre_motivo: 'ASC' },
    });
  }

  // Obtener un motivo específico
  async findOne(id: number) {
    const motivo = await this.motivoRepo.findOne({
      where: { id_motivo: id },
    });

    if (!motivo) {
      throw new NotFoundException(`Motivo con ID ${id} no encontrado`);
    }

    return motivo;
  }

  // Crear nuevo motivo
  async create(data: Partial<Motivo>) {
    if (!data.nombre_motivo) {
      throw new Error('El nombre del motivo es obligatorio');
    }

    // Verificar si ya existe un motivo con ese nombre
    const existe = await this.motivoRepo.findOne({
      where: { nombre_motivo: data.nombre_motivo },
    });

    if (existe) {
      throw new ConflictException(
        `Ya existe un motivo con el nombre "${data.nombre_motivo}"`,
      );
    }

    const motivo = this.motivoRepo.create({
      ...data,
      estatus: data.estatus || 'ACTIVO',
    });

    return this.motivoRepo.save(motivo);
  }

  // Actualizar motivo
  async update(id: number, data: Partial<Motivo>) {
    const motivoExiste = await this.motivoRepo.findOne({
      where: { id_motivo: id },
    });

    if (!motivoExiste) {
      throw new NotFoundException(`Motivo con ID ${id} no encontrado`);
    }

    // Si se está actualizando el nombre, verificar que no exista otro con ese nombre
    if (data.nombre_motivo && data.nombre_motivo !== motivoExiste.nombre_motivo) {
      const nombreExiste = await this.motivoRepo.findOne({
        where: { nombre_motivo: data.nombre_motivo },
      });

      if (nombreExiste) {
        throw new ConflictException(
          `Ya existe un motivo con el nombre "${data.nombre_motivo}"`,
        );
      }
    }

    await this.motivoRepo.update({ id_motivo: id }, data);
    return this.findOne(id);
  }

  // Eliminar motivo (soft delete - cambiar estatus a INACTIVO)
  async remove(id: number) {
    const motivoExiste = await this.motivoRepo.findOne({
      where: { id_motivo: id },
    });

    if (!motivoExiste) {
      throw new NotFoundException(`Motivo con ID ${id} no encontrado`);
    }

    await this.motivoRepo.update(
      { id_motivo: id },
      { estatus: 'INACTIVO' },
    );

    return { ok: true, message: `Motivo ${id} desactivado correctamente` };
  }
}