import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorporacionesService } from './corporaciones.service';
import { CorporacionesController } from './corporaciones.controller';
import { Corporacion } from './corporaciones.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Corporacion])],
  providers: [CorporacionesService],
  controllers: [CorporacionesController],
  exports: [CorporacionesService],
})
export class CorporacionesModule {}