import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incidencia } from './incidencias.entity';
import { Corporacion } from '../corporaciones/corporaciones.entity';
import { Motivo } from '../motivos/motivos.entity';

@Injectable()
export class IncidenciasService {
  constructor(
    @InjectRepository(Incidencia)
    private readonly incidenciaRepo: Repository<Incidencia>,
    @InjectRepository(Corporacion)
    private readonly corporacionRepo: Repository<Corporacion>,
    @InjectRepository(Motivo)
    private readonly motivoRepo: Repository<Motivo>,
  ) {}

  // Obtener todas las incidencias de un evento con relaciones
  async findByEvento(idEvento: number) {
    return this.incidenciaRepo.find({
      where: { id_evento: idEvento },
      relations: ['corporacion', 'motivo', 'evento', 'evidencias'],
      order: { fecha: 'DESC', hora: 'DESC' },
    });
  }

  // Obtener una incidencia específica
  async findOne(id: number) {
    const incidencia = await this.incidenciaRepo.findOne({
      where: { id_incidencia: id },
      relations: [
        'corporacion',
        'motivo',
        'evento',
        'usuarioCrea',
        'usuarioCierra',
        'evidencias',
      ],
    });

    if (!incidencia) {
      throw new NotFoundException(`Incidencia con ID ${id} no encontrada`);
    }

    return incidencia;
  }

  // Crear nueva incidencia
  async create(data: Partial<Incidencia>) {
    if (
      !data.id_evento ||
      !data.fecha ||
      !data.hora ||
      !data.id_corporacion ||
      !data.id_motivo ||
      !data.ubicacion ||
      !data.descripcion ||
      !data.usuario_crea
    ) {
      throw new Error('Faltan campos obligatorios');
    }

    const incidencia = this.incidenciaRepo.create({
      ...data,
      estatus: data.estatus || 'ABIERTA',
    });

    return this.incidenciaRepo.save(incidencia);
  }

  // Actualizar incidencia (corregido)
  async update(id: number, data: Partial<Incidencia>) {
    const incidenciaExiste = await this.incidenciaRepo.findOne({
      where: { id_incidencia: id },
    });

    if (!incidenciaExiste) {
      throw new NotFoundException(`Incidencia con ID ${id} no encontrada`);
    }

    // ❌ Excluir relaciones
    const {
      evidencias,
      evento,
      corporacion,
      motivo,
      usuarioCrea,
      usuarioCierra,
      ...soloCampos
    } = data;

    await this.incidenciaRepo.update({ id_incidencia: id }, soloCampos);
    return this.findOne(id);
  }

  // Cerrar incidencia (ajustado para evitar problemas)
  async cerrar(id: number, usuarioCierra: number) {
    const incidenciaExiste = await this.incidenciaRepo.findOne({
      where: { id_incidencia: id },
    });

    if (!incidenciaExiste) {
      throw new NotFoundException(`Incidencia con ID ${id} no encontrada`);
    }

    await this.incidenciaRepo.update(
      { id_incidencia: id },
      {
        estatus: 'CERRADA',
        usuario_cierra: usuarioCierra,
        fecha_cierre: new Date(),
      },
    );

    return this.findOne(id);
  }

  // Eliminar incidencia
  async remove(id: number) {
    const incidenciaExiste = await this.incidenciaRepo.findOne({
      where: { id_incidencia: id },
    });

    if (!incidenciaExiste) {
      throw new NotFoundException(`Incidencia con ID ${id} no encontrada`);
    }

    await this.incidenciaRepo.delete({ id_incidencia: id });
    return { ok: true, message: `Incidencia ${id} eliminada correctamente` };
  }

  // Obtener corporaciones activas
  async getCorporaciones() {
    return this.corporacionRepo.find({
      where: { estatus: 'ACTIVO' },
      order: { nombre_corporacion: 'ASC' },
    });
  }

  // Obtener motivos activos
  async getMotivos() {
    return this.motivoRepo.find({
      where: { estatus: 'ACTIVO' },
      order: { nombre_motivo: 'ASC' },
    });
  }

  // Filtrar incidencias
  async filtrar(idEvento: number, filtros: any) {
    const query = this.incidenciaRepo
      .createQueryBuilder('incidencia')
      .leftJoinAndSelect('incidencia.corporacion', 'corporacion')
      .leftJoinAndSelect('incidencia.motivo', 'motivo')
      .leftJoinAndSelect('incidencia.evento', 'evento')
      .leftJoinAndSelect('incidencia.evidencias', 'evidencias')
      .where('incidencia.id_evento = :idEvento', { idEvento });

    if (filtros.id_incidencia) {
      query.andWhere('incidencia.id_incidencia = :id', {
        id: filtros.id_incidencia,
      });
    }

    if (filtros.descripcion) {
      query.andWhere('incidencia.descripcion ILIKE :descripcion', {
        descripcion: `%${filtros.descripcion}%`,
      });
    }

    if (filtros.fecha) {
      query.andWhere('incidencia.fecha = :fecha', { fecha: filtros.fecha });
    }

    if (filtros.id_corporacion) {
      query.andWhere('incidencia.id_corporacion = :corporacion', {
        corporacion: filtros.id_corporacion,
      });
    }

    if (filtros.id_motivo) {
      query.andWhere('incidencia.id_motivo = :motivo', {
        motivo: filtros.id_motivo,
      });
    }

    if (filtros.estatus) {
      query.andWhere('incidencia.estatus = :estatus', {
        estatus: filtros.estatus,
      });
    }

    query.orderBy('incidencia.fecha', 'DESC').addOrderBy('incidencia.hora', 'DESC');

    return query.getMany();
  }

  // Obtener estadísticas de incidencias con evidencias
  async getEstadisticasConEvidencias(idEvento: number) {
    const incidencias = await this.findByEvento(idEvento);

    const conEvidencias = incidencias.filter(
      (i) => i.evidencias && i.evidencias.length > 0,
    );
    const sinEvidencias = incidencias.filter(
      (i) => !i.evidencias || i.evidencias.length === 0,
    );

    return {
      total: incidencias.length,
      con_evidencias: conEvidencias.length,
      sin_evidencias: sinEvidencias.length,
      porcentaje_con_evidencias:
        incidencias.length > 0
          ? ((conEvidencias.length / incidencias.length) * 100).toFixed(2)
          : 0,
    };
  }
}
