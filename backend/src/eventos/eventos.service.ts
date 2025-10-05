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

  // Obtener todos los eventos activos
  findActivos() {
    return this.eventoRepo.find({
      where: { estatus: 'ACTIVO' },
      order: { fecha_inicio: 'ASC' },
    });
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
    const eventoData = {
      ...data,
      estatus: data.estatus || 'ACTIVO',
    };

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

    // Actualizar el evento
    await this.eventoRepo.update({ id_evento: id }, data);
    
    // Retornar el evento actualizado
    return this.eventoRepo.findOne({ where: { id_evento: id } });
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