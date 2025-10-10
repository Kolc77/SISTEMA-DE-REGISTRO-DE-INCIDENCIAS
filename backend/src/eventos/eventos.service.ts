import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evento } from './evento.entity';

@Injectable()
export class EventosService {
  constructor(
    @InjectRepository(Evento)
    private readonly eventoRepo: Repository<Evento>,
  ) {}

  private findByStatus(estatus: 'ACTIVO' | 'INACTIVO') {
    return this.eventoRepo.find({
      where: { estatus },
      order: { fecha_inicio: 'ASC' },
    });
  }

  // Obtener todos los eventos activos
  findActivos() {
    return this.findByStatus('ACTIVO');
  }

  // Obtener todos los eventos inactivos (pasados)
  findInactivos() {
    return this.findByStatus('INACTIVO');
  }

  // Obtener un evento por ID
  async findOne(id: number) {
    const evento = await this.eventoRepo.findOne({ 
      where: { id_evento: id } 
    });
    
    if (!evento) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }
    
    return evento;
  }

  // Crear un nuevo evento
  async create(data: Partial<Evento>) {
    // Validaciones básicas
    if (!data.nombre_evento || !data.fecha_inicio) {
      throw new Error('Nombre y fecha de inicio son obligatorios');
    }

    // Establecer valores por defecto
    const eventoData: Partial<Evento> = {
      ...data,
      estatus: ((data.estatus || 'ACTIVO') as string).trim().toUpperCase(),
    };

    if (eventoData.fecha_inicio) {
      eventoData.fecha_inicio = new Date(eventoData.fecha_inicio);
    }

    const rawFechaFin = data.fecha_fin as any;
    if (rawFechaFin === '' || rawFechaFin === undefined || rawFechaFin === null) {
      eventoData.fecha_fin = null;
    } else if (rawFechaFin) {
      eventoData.fecha_fin = new Date(rawFechaFin);
    }

    const evento = this.eventoRepo.create(eventoData);
    return this.eventoRepo.save(evento);
  }

  // Actualizar un evento existente
  async update(id: number, data: Partial<Evento>) {
    // Verificar que el evento existe
    const eventoExiste = await this.eventoRepo.findOne({ 
      where: { id_evento: id } 
    });
    
    if (!eventoExiste) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }

    const payload: Partial<Evento> = {};

    if (data.estatus === undefined && data.fecha_inicio === undefined && data.fecha_fin === undefined && data.descripcion === undefined && data.ubicacion === undefined && data.nombre_evento === undefined) {
      return eventoExiste;
    }

    if (data.nombre_evento !== undefined) {
      payload.nombre_evento = data.nombre_evento;
    }

    if (data.fecha_inicio) {
      payload.fecha_inicio = new Date(data.fecha_inicio as any);
    }

    const rawFechaFinUpdate = data.fecha_fin as any;
    if (rawFechaFinUpdate === '' || rawFechaFinUpdate === null) {
      payload.fecha_fin = null;
    } else if (rawFechaFinUpdate) {
      payload.fecha_fin = new Date(rawFechaFinUpdate);
    }

    if (data.ubicacion !== undefined) {
      payload.ubicacion = data.ubicacion;
    }

    if (data.descripcion !== undefined) {
      payload.descripcion = data.descripcion;
    }

    if (data.estatus !== undefined) {
      payload.estatus = String(data.estatus).trim().toUpperCase() as 'ACTIVO' | 'INACTIVO';
    }

    if (Object.keys(payload).length === 0) {
      return eventoExiste;
    }

    await this.eventoRepo.update({ id_evento: id }, payload);
    return this.findOne(id);
  }

  // Eliminar un evento (borrado lógico)
  async remove(id: number) {
    // Verificar que el evento existe
    const eventoExiste = await this.eventoRepo.findOne({ 
      where: { id_evento: id } 
    });
    
    if (!eventoExiste) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }

    // Opción 1: Borrado lógico (cambiar estatus a INACTIVO)
    await this.eventoRepo.update(
      { id_evento: id }, 
      { estatus: 'INACTIVO' }
    );

    // Opción 2: Borrado físico (descomentar si prefieres eliminar completamente)
    // await this.eventoRepo.delete({ id_evento: id });

    return { 
      ok: true, 
      message: `Evento ${id} eliminado correctamente` 
    };
  }

  // Método adicional: Buscar eventos por fecha
  async findByDate(fecha: Date) {
    return this.eventoRepo.find({
      where: { fecha_inicio: fecha },
      order: { fecha_inicio: 'ASC' },
    });
  }

  // Método adicional: Buscar eventos por nombre
  async findByName(nombre: string) {
    return this.eventoRepo
      .createQueryBuilder('evento')
      .where('evento.nombre_evento LIKE :nombre', { nombre: `%${nombre}%` })
      .andWhere('evento.estatus = :estatus', { estatus: 'ACTIVO' })
      .orderBy('evento.fecha_inicio', 'ASC')
      .getMany();
  }
}
