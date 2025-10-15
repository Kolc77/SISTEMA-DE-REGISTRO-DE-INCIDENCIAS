import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Res,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EvidenciasService } from './evidencias.service';
import { CreateEvidenciaDto } from './dto/evidencias.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('evidencias')
export class EvidenciasController {
  constructor(private readonly evidenciasService: EvidenciasService) {}

  // GET /evidencias/incidencia/:idIncidencia - Obtener evidencias de una incidencia
  @Get('incidencia/:idIncidencia')
  findByIncidencia(@Param('idIncidencia', ParseIntPipe) idIncidencia: number) {
    return this.evidenciasService.findByIncidencia(idIncidencia);
  }

  // GET /evidencias/:id - Obtener una evidencia específica
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.evidenciasService.findOne(id);
  }

  // GET /evidencias/:id/descargar - Descargar archivo de evidencia
  @Get(':id/descargar')
  async descargar(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    return this.evidenciasService.descargarArchivo(id, res);
  }

  // POST /evidencias/upload - Subir archivo de evidencia
  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'CAPTURISTA')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/evidencias',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `evidencia-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException('Solo se permiten archivos JPG, PNG o PDF'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
      },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { id_incidencia: string; usuario_subio: string },
    @Req() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    const ext = extname(file.originalname).substring(1).toUpperCase();
    const tipoValido = ['JPG', 'JPEG', 'PNG', 'PDF'].includes(ext) 
      ? (ext === 'JPEG' ? 'JPG' : ext) 
      : 'JPG';

    const incidenciaId = parseInt(body.id_incidencia, 10);
    if (Number.isNaN(incidenciaId)) {
      throw new BadRequestException('id_incidencia inválido');
    }

    const { userId, role } = req.user;

    if (role === 'CAPTURISTA') {
      await this.evidenciasService.validateCapturistaOwnership(incidenciaId, userId);
    }

    return this.evidenciasService.create({
      id_incidencia: incidenciaId,
      usuario_subio: userId,
      ruta_archivo: file.path,
      tipo_archivo: tipoValido as 'JPG' | 'PNG' | 'PDF',
    });
  }

  // POST /evidencias - Crear evidencia sin archivo (registro manual)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createEvidenciaDto: CreateEvidenciaDto) {
    return this.evidenciasService.create(createEvidenciaDto);
  }

  // DELETE /evidencias/:id - Eliminar evidencia
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.evidenciasService.remove(id);
  }
}
