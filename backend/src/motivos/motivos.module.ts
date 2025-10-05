import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MotivosService } from './motivos.service';
import { MotivosController } from './motivos.controller';
import { Motivo } from './motivos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Motivo])],
  providers: [MotivosService],
  controllers: [MotivosController],
  exports: [MotivosService],
})
export class MotivosModule {}