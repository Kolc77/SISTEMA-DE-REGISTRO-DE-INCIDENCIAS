import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Corporacion } from './corporaciones.entity';

@Injectable()
export class CorporacionesService {
  constructor(
    @InjectRepository(Corporacion)
    private readonly corporacionRepo: Repository<Corporacion>,
  ) {}

  // Obtener todas las corporaciones
  async findAll() {
    return this.corporacionRepo.find({
      order: { nombre_corporacion: 'ASC' },
    });
  }

  // Obtener solo corporaciones activas
  async findActivas() {
    return this.corporacionRepo.find({
      where: { estatus: 'ACTIVO' },
      order: { nombre_corporacion: 'ASC' },
    });
  }

  // Obtener una corporación específica
  async findOne(id: number) {
    const corporacion = await this.corporacionRepo.findOne({
      where: { id_corporacion: id },
    });

    if (!corporacion) {
      throw new NotFoundException(`Corporación con ID ${id} no encontrada`);
    }

    return corporacion;
  }

  // Crear nueva corporación
  async create(data: Partial<Corporacion>) {
    if (!data.nombre_corporacion) {
      throw new Error('El nombre de la corporación es obligatorio');
    }

    // Verificar si ya existe una corporación con ese nombre
    const existe = await this.corporacionRepo.findOne({
      where: { nombre_corporacion: data.nombre_corporacion },
    });

    if (existe) {
      throw new ConflictException(
        `Ya existe una corporación con el nombre "${data.nombre_corporacion}"`,
      );
    }

    const corporacion = this.corporacionRepo.create({
      ...data,
      estatus: data.estatus || 'ACTIVO',
    });

    return this.corporacionRepo.save(corporacion);
  }

  // Actualizar corporación
  async update(id: number, data: Partial<Corporacion>) {
    const corporacionExiste = await this.corporacionRepo.findOne({
      where: { id_corporacion: id },
    });

    if (!corporacionExiste) {
      throw new NotFoundException(`Corporación con ID ${id} no encontrada`);
    }

    // Si se está actualizando el nombre, verificar que no exista otro con ese nombre
    if (data.nombre_corporacion && data.nombre_corporacion !== corporacionExiste.nombre_corporacion) {
      const nombreExiste = await this.corporacionRepo.findOne({
        where: { nombre_corporacion: data.nombre_corporacion },
      });

      if (nombreExiste) {
        throw new ConflictException(
          `Ya existe una corporación con el nombre "${data.nombre_corporacion}"`,
        );
      }
    }

    await this.corporacionRepo.update({ id_corporacion: id }, data);
    return this.findOne(id);
  }

  // Eliminar corporación (soft delete - cambiar estatus a INACTIVO)
  async remove(id: number) {
    const corporacionExiste = await this.corporacionRepo.findOne({
      where: { id_corporacion: id },
    });

    if (!corporacionExiste) {
      throw new NotFoundException(`Corporación con ID ${id} no encontrada`);
    }

    await this.corporacionRepo.update(
      { id_corporacion: id },
      { estatus: 'INACTIVO' },
    );


    return { ok: true, message: `Corporación ${id} desactivada correctamente` };
  }

  
}