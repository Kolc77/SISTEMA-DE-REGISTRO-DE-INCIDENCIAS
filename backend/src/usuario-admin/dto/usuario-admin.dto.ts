export class CreateUsuarioAdminDto {
  nombre: string;
  correo: string;
  password: string;
  rol?: 'ADMIN' | 'CAPTURISTA';
  estatus?: 'ACTIVO' | 'INACTIVO';
}

export class UpdateUsuarioAdminDto {
  nombre?: string;
  correo?: string;
  password?: string;
  rol?: 'ADMIN' | 'CAPTURISTA';
  estatus?: 'ACTIVO' | 'INACTIVO';
}
