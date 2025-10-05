import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CorporacionesService } from './corporaciones.service';
import { Corporacion } from './corporaciones.entity';

@Controller('corporaciones')
export class CorporacionesController {
  constructor(private readonly corporacionesService: CorporacionesService) {}

  // GET /corporaciones - Obtener todas las corporaciones
  @Get()
  findAll() {
    return this.corporacionesService.findAll();
  }

  // GET /corporaciones/activas - Obtener solo corporaciones activas
  @Get('activas')
  findActivas() {
    return this.corporacionesService.findActivas();
  }

  // GET /corporaciones/:id - Obtener una corporación específica
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.corporacionesService.findOne(id);
  }

  // POST /corporaciones - Crear nueva corporación
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: Partial<Corporacion>) {
    return this.corporacionesService.create(data);
  }

  // PUT /corporaciones/:id - Actualizar corporación
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Corporacion>,
  ) {
    return this.corporacionesService.update(id, data);
  }

  // DELETE /corporaciones/:id - Eliminar corporación (soft delete)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.corporacionesService.remove(id);
  }
}