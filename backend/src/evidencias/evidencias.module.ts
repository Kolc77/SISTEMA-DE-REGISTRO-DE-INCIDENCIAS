import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { EvidenciasService } from './evidencias.service';
import { EvidenciasController } from './evidencias.controller';
import { Evidencia } from './evidencias.entity';
import { Incidencia } from '../incidencias/incidencias.entity';
import { Usuario } from '../users/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evidencia, Incidencia, Usuario]),
    MulterModule.register({
      dest: './uploads/evidencias',
    }),
  ],
  providers: [EvidenciasService],
  controllers: [EvidenciasController],
  exports: [EvidenciasService],
})
export class EvidenciasModule {}