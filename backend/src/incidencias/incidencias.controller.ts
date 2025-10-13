import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { IncidenciasService } from './incidencias.service';
import { Incidencia } from './incidencias.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('incidencias')
export class IncidenciasController {
  constructor(private readonly incidenciasService: IncidenciasService) {}

  // Rutas públicas (sin auth)
  @Get('evento/:idEvento')
  findByEvento(@Param('idEvento', ParseIntPipe) idEvento: number) {
    return this.incidenciasService.findByEvento(idEvento).then((data) => ({ ok: true, data }));
  }

  @Get('evento/:idEvento/filtrar')
  filtrar(
    @Param('idEvento', ParseIntPipe) idEvento: number,
    @Query() filtros: any,
  ) {
    return this.incidenciasService.filtrar(idEvento, filtros).then((data) => ({ ok: true, data }));
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.incidenciasService.findOne(id).then((data) => ({ ok: true, data }));
  }

  @Get('catalogos/corporaciones')
  getCorporaciones() {
    return this.incidenciasService.getCorporaciones().then((data) => ({ ok: true, data }));
  }

  @Get('catalogos/motivos')
  getMotivos() {
    return this.incidenciasService.getMotivos().then((data) => ({ ok: true, data }));
  }

  // Crear - ADMIN y CAPTURISTA
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'CAPTURISTA')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: Partial<Incidencia>, @Req() req: any) {
    const userId = req.user.userId;
    return this.incidenciasService
      .create({ ...data, usuario_crea: userId })
      .then((created) => ({ ok: true, data: created }));
  }

  // Editar - ADMIN puede todo, CAPTURISTA solo sus propias
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'CAPTURISTA')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Incidencia>,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    const role = req.user.role;

    // Si es CAPTURISTA, verificar que sea su incidencia
    if (role === 'CAPTURISTA') {
      const incidencia = await this.incidenciasService.findOne(id);
      if (incidencia.usuario_crea !== userId) {
        throw new Error('No tienes permiso para editar esta incidencia');
      }
    }

    return this.incidenciasService.update(id, data).then((updated) => ({ ok: true, data: updated }));
  }

  // Cerrar - ADMIN y CAPTURISTA
  @Put(':id/cerrar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'CAPTURISTA')
  cerrar(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userId = req.user.userId;
    return this.incidenciasService.cerrar(id, userId).then((data) => ({ ok: true, data }));
  }

  // Eliminar - SOLO ADMIN
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.incidenciasService.remove(id);
  }
}
