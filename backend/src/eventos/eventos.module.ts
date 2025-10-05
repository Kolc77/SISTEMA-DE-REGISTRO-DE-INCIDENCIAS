import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventosService } from './eventos.service';
import { EventosController } from './eventos.controller';
import { Evento } from './evento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Evento])],
  providers: [EventosService],
  controllers: [EventosController],
})
export class EventosModule {}