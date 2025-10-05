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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EvidenciasService } from './evidencias.service';
import { CreateEvidenciaDto } from './dto/evidencias.dto';

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
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { id_incidencia: string; usuario_subio: string },
  ) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    const ext = extname(file.originalname).substring(1).toUpperCase();
    const tipoValido = ['JPG', 'JPEG', 'PNG', 'PDF'].includes(ext) 
      ? (ext === 'JPEG' ? 'JPG' : ext) 
      : 'JPG';

    return this.evidenciasService.create({
      id_incidencia: parseInt(body.id_incidencia),
      usuario_subio: parseInt(body.usuario_subio),
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