// DTOs para validación de datos de evidencia

export class CreateEvidenciaDto {
  id_incidencia: number;
  usuario_subio: number;
  ruta_archivo: string;
  tipo_archivo: 'JPG' | 'PNG' | 'PDF';
}