import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
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

  // Obtener una corporacion especifica
  async findOne(id: number) {
    const corporacion = await this.corporacionRepo.findOne({
      where: { id_corporacion: id },
    });

    if (!corporacion) {
      throw new NotFoundException(`Corporacion con ID ${id} no encontrada`);
    }

    return corporacion;
  }

  // Crear nueva corporacion
  async create(data: Partial<Corporacion>) {
    if (!data.nombre_corporacion) {
      throw new Error('El nombre de la corporacion es obligatorio');
    }

    // Verificar si ya existe una corporacion con ese nombre
    const existe = await this.corporacionRepo.findOne({
      where: { nombre_corporacion: data.nombre_corporacion },
    });

    if (existe) {
      throw new ConflictException(
        `Ya existe una corporacion con el nombre "${data.nombre_corporacion}"`,
      );
    }

    const corporacion = this.corporacionRepo.create({
      ...data,
      estatus: data.estatus || 'ACTIVO',
    });

    return this.corporacionRepo.save(corporacion);
  }

  // Actualizar corporacion
  async update(id: number, data: Partial<Corporacion>) {
    const corporacionExiste = await this.corporacionRepo.findOne({
      where: { id_corporacion: id },
    });

    if (!corporacionExiste) {
      throw new NotFoundException(`Corporacion con ID ${id} no encontrada`);
    }

    // Si se esta actualizando el nombre, verificar que no exista otro con ese nombre
    if (
      data.nombre_corporacion &&
      data.nombre_corporacion !== corporacionExiste.nombre_corporacion
    ) {
      const nombreExiste = await this.corporacionRepo.findOne({
        where: { nombre_corporacion: data.nombre_corporacion },
      });

      if (nombreExiste) {
        throw new ConflictException(
          `Ya existe una corporacion con el nombre "${data.nombre_corporacion}"`,
        );
      }
    }

    await this.corporacionRepo.update({ id_corporacion: id }, data);
    return this.findOne(id);
  }

  // Eliminar corporacion de forma definitiva
  async remove(id: number) {
    const corporacionExiste = await this.corporacionRepo.findOne({
      where: { id_corporacion: id },
    });

    if (!corporacionExiste) {
      throw new NotFoundException(`Corporacion con ID ${id} no encontrada`);
    }

    try {
      const result = await this.corporacionRepo.delete({ id_corporacion: id });
      if (!result.affected) {
        throw new NotFoundException(`Corporacion con ID ${id} no encontrada`);
      }
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError?.code === '23503'
      ) {
        throw new ConflictException(
          'No es posible eliminar la corporacion porque esta relacionada con incidencias registradas.',
        );
      }
      throw error;
    }

    return { ok: true, message: `Corporacion ${id} eliminada correctamente` };
  }

  // Alternar estatus ACTIVO/INACTIVO
  async toggle(id: number) {
    const corporacion = await this.corporacionRepo.findOne({
      where: { id_corporacion: id },
    });
    if (!corporacion) {
      throw new NotFoundException(`Corporacion con ID ${id} no encontrada`);
    }
    const nuevo = corporacion.estatus === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    await this.corporacionRepo.update(
      { id_corporacion: id },
      { estatus: nuevo },
    );
    return this.findOne(id);
  }
}
