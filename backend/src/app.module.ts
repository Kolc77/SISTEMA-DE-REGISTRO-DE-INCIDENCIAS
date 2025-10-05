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

@Module({
  imports: [
    // 1) Carga variables de entorno (.env) en toda la app
    ConfigModule.forRoot({ isGlobal: true }),

    // 2) Conexión a Postgres (Neon) con SSL explícito
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        url: cfg.get<string>('DATABASE_URL'), // toma tu cadena de Neon
        autoLoadEntities: true,
        synchronize: false, // ⚠️ en prod siempre false
        // Neon suele requerir SSL explícito:
        ssl: { rejectUnauthorized: false },
        extra: { ssl: { rejectUnauthorized: false } },
      }),
    }),

    // 3) Repos/entidades que usarán tus servicios
    TypeOrmModule.forFeature([Usuario]),

    // 4) Módulos de tu app
    UsersModule,
    AuthModule,
    EventosModule,
    IncidenciasModule,
    CorporacionesModule,
    MotivosModule,
    EvidenciasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
