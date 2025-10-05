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
import { EventosService } from './eventos.service';
import { Evento } from './evento.entity';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  // GET /eventos/activos - Obtener todos los eventos activos
  @Get('activos')
  findActivos() {
    return this.eventosService.findActivos();
  }

  // GET /eventos/:id - Obtener un evento específico
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventosService.findOne(id);
  }

  // POST /eventos - Crear un nuevo evento
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: Partial<Evento>) {
    return this.eventosService.create(data);
  }

  // PUT /eventos/:id - Actualizar un evento existente
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Evento>,
  ) {
    return this.eventosService.update(id, data);
  }

  // DELETE /eventos/:id - Eliminar un evento
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventosService.remove(id);
  }
}