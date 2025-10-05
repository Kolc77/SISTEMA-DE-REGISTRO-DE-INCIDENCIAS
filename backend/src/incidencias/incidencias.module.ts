import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncidenciasService } from './incidencias.service';
import { IncidenciasController } from './incidencias.controller';
import { Incidencia } from './incidencias.entity';
import { Corporacion } from '../corporaciones/corporaciones.entity';
import { Motivo } from '../motivos/motivos.entity';
import { Evento } from '../eventos/evento.entity';
import { Usuario } from '../users/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Incidencia,
      Corporacion,
      Motivo,
      Evento,
      Usuario,
    ]),
  ],
  providers: [IncidenciasService],
  controllers: [IncidenciasController],
  exports: [IncidenciasService],
})
export class IncidenciasModule {}