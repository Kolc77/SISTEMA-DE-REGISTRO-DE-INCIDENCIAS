import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evidencia } from './evidencias.entity';
import { CreateEvidenciaDto } from './dto/evidencias.dto';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { Incidencia } from '../incidencias/incidencias.entity';

@Injectable()
export class EvidenciasService {
  constructor(
    @InjectRepository(Evidencia)
    private readonly evidenciaRepo: Repository<Evidencia>,
    @InjectRepository(Incidencia)
    private readonly incidenciaRepo: Repository<Incidencia>,
  ) {}

  async validateCapturistaOwnership(incidenciaId: number, userId: number) {
    const incidencia = await this.incidenciaRepo.findOne({
      where: { id_incidencia: incidenciaId },
      select: ['id_incidencia', 'usuario_crea'],
    });

    if (!incidencia) {
      throw new NotFoundException(`Incidencia con ID ${incidenciaId} no encontrada`);
    }

    if (incidencia.usuario_crea !== userId) {
      throw new ForbiddenException('Solo puedes subir evidencias de incidencias que registraste');
    }
  }

  // Obtener todas las evidencias de una incidencia
  async findByIncidencia(idIncidencia: number) {
    return this.evidenciaRepo.find({
      where: { id_incidencia: idIncidencia },
      relations: ['usuarioSubio'],
      order: { fecha_subida: 'DESC' },
    });
  }

  // Obtener una evidencia específica
  async findOne(id: number) {
    const evidencia = await this.evidenciaRepo.findOne({
      where: { id_evidencia: id },
      relations: ['incidencia', 'usuarioSubio'],
    });

    if (!evidencia) {
      throw new NotFoundException(`Evidencia con ID ${id} no encontrada`);
    }

    return evidencia;
  }

  // Crear nueva evidencia
  async create(createEvidenciaDto: CreateEvidenciaDto) {
    const { id_incidencia, usuario_subio, ruta_archivo, tipo_archivo } =
      createEvidenciaDto;

    if (!id_incidencia || !usuario_subio || !ruta_archivo || !tipo_archivo) {
      throw new BadRequestException('Todos los campos son obligatorios');
    }

    if (!['JPG', 'PNG', 'PDF'].includes(tipo_archivo)) {
      throw new BadRequestException(
        'El tipo de archivo debe ser JPG, PNG o PDF',
      );
    }

    const evidencia = this.evidenciaRepo.create(createEvidenciaDto);
    return this.evidenciaRepo.save(evidencia);
  }

  // Eliminar evidencia
  async remove(id: number) {
    const evidencia = await this.evidenciaRepo.findOne({
      where: { id_evidencia: id },
    });

    if (!evidencia) {
      throw new NotFoundException(`Evidencia con ID ${id} no encontrada`);
    }

    // Intentar eliminar el archivo físico
    try {
      if (fs.existsSync(evidencia.ruta_archivo)) {
        fs.unlinkSync(evidencia.ruta_archivo);
      }
    } catch (error) {
      console.error('Error al eliminar archivo físico:', error);
      // Continuar con la eliminación del registro aunque falle la eliminación del archivo
    }

    await this.evidenciaRepo.delete({ id_evidencia: id });

    return {
      ok: true,
      message: `Evidencia ${id} eliminada correctamente`,
    };
  }

  // Descargar archivo de evidencia
  async descargarArchivo(id: number, res: Response) {
    const evidencia = await this.findOne(id);

    if (!fs.existsSync(evidencia.ruta_archivo)) {
      throw new NotFoundException('Archivo no encontrado en el servidor');
    }

    try {
      const fileName = path.basename(evidencia.ruta_archivo);
      res.download(evidencia.ruta_archivo, fileName);
    } catch (error) {
      throw new InternalServerErrorException('Error al descargar el archivo');
    }
  }

  // Obtener estadísticas de evidencias por incidencia
  async getEstadisticasPorIncidencia(idIncidencia: number) {
    const evidencias = await this.findByIncidencia(idIncidencia);

    const porTipo = evidencias.reduce(
      (acc, ev) => {
        acc[ev.tipo_archivo] = (acc[ev.tipo_archivo] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      total: evidencias.length,
      por_tipo: porTipo,
      evidencias,
    };
  }
}
