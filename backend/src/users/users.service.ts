import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(Usuario) private repo: Repository<Usuario>) {}

  findByEmail(email: string) {
    return this.repo.findOne({
      where: { correo: email },
    });
  }

  findById(id: number) {
    return this.repo.findOne({
      where: { idUsuario: id },
    });
  }
}
