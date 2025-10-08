import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../users/usuario.entity';
import { UsuariosAdminService } from './usuario-admin.service';
import { UsuariosAdminController } from './usuario-admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [UsuariosAdminController],
  providers: [UsuariosAdminService],
  exports: [UsuariosAdminService],
})
export class UsuariosAdminModule {}