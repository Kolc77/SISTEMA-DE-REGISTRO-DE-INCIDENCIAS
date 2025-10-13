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
import { MotivosService } from './motivos.service';
import { Motivo } from './motivos.entity';

@Controller('motivos')
export class MotivosController {
  constructor(private readonly motivosService: MotivosService) {}

  // GET /motivos - Obtener todos los motivos
  @Get()
  findAll() {
    return this.motivosService.findAll().then((data) => ({ ok: true, data }));
  }

  // GET /motivos/activos - Obtener solo motivos activos
  @Get('activos')
  findActivos() {
    return this.motivosService.findActivos().then((data) => ({ ok: true, data }));
  }

  // GET /motivos/:id - Obtener un motivo específico
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.motivosService.findOne(id).then((data) => ({ ok: true, data }));
  }

  // POST /motivos - Crear nuevo motivo
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: Partial<Motivo>) {
    return this.motivosService.create(data).then((created) => ({ ok: true, data: created }));
  }

  // PUT /motivos/:id - Actualizar motivo
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Motivo>,
  ) {
    return this.motivosService.update(id, data).then((updated) => ({ ok: true, data: updated }));
  }

  // PATCH /motivos/:id/toggle - Alternar estatus ACTIVO/INACTIVO
  @Patch(':id/toggle')
  toggle(@Param('id', ParseIntPipe) id: number) {
    return this.motivosService.toggle(id).then((updated) => ({ ok: true, data: updated }));
  }

  // DELETE /motivos/:id - Eliminar motivo (soft delete)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.motivosService.remove(id);
  }
}
