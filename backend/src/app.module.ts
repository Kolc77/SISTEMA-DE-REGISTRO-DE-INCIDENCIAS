// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Usuario } from './users/usuario.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventosModule } from './eventos/eventos.module';
import { IncidenciasModule } from './incidencias/incidencias.module';
import { CorporacionesModule } from './corporaciones/corporaciones.module';
import { MotivosModule } from './motivos/motivos.module';
import { EvidenciasModule } from './evidencias/evidencias.module';
import { UsuariosAdminModule } from './usuario-admin/usuario-admin.module'; // ← CAMBIAR AQUÍ

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        url: cfg.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: false,
        ssl: { rejectUnauthorized: false },
        extra: { ssl: { rejectUnauthorized: false } },
      }),
    }),

    TypeOrmModule.forFeature([Usuario]),

    UsersModule,
    AuthModule,
    EventosModule,
    IncidenciasModule,
    CorporacionesModule,
    MotivosModule,
    EvidenciasModule,
    UsuariosAdminModule, // ← USAR ESTE
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}