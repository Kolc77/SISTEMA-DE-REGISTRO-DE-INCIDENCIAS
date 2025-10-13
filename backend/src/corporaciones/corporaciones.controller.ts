import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
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
    return this.corporacionesService.findAll().then((data) => ({ ok: true, data }));
  }

  // GET /corporaciones/activas - Obtener solo corporaciones activas
  @Get('activas')
  findActivas() {
    return this.corporacionesService.findActivas().then((data) => ({ ok: true, data }));
  }

  // GET /corporaciones/:id - Obtener una corporación específica
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.corporacionesService.findOne(id).then((data) => ({ ok: true, data }));
  }

  // POST /corporaciones - Crear nueva corporación
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: Partial<Corporacion>) {
    return this.corporacionesService.create(data).then((created) => ({ ok: true, data: created }));
  }

  // PUT /corporaciones/:id - Actualizar corporación
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Corporacion>,
  ) {
    return this.corporacionesService.update(id, data).then((updated) => ({ ok: true, data: updated }));
  }

  // PATCH /corporaciones/:id/toggle - Alternar estatus ACTIVO/INACTIVO
  @Patch(':id/toggle')
  toggle(@Param('id', ParseIntPipe) id: number) {
    return this.corporacionesService.toggle(id).then((updated) => ({ ok: true, data: updated }));
  }

  // DELETE /corporaciones/:id - Eliminar corporación (soft delete)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.corporacionesService.remove(id);
  }
}
