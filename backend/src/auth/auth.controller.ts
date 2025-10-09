import { Body, Controller, Post, Res, Get, UseGuards, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

class LoginDto { email: string; password: string; }

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) { }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.auth.validateUser(dto.email, dto.password);
    const token = this.auth.signAccess(user);
    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.COOKIE_SECURE === 'true', // en .env pon COOKIE_SECURE=false
      maxAge: 15 * 60 * 1000,
      path: '/',
    });
    return { ok: true, userId: user.idUsuario, role: user.rol, nombre: user.nombre };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    if (!req?.user?.userId) {
      return { ok: false, message: 'No autenticado' };
    }

    const user = await this.auth.getUserById(req.user.userId);
    if (!user) {
      return { ok: false, message: 'Usuario no encontrado' };
    }

    return {
      ok: true,
      userId: user.idUsuario,
      role: user.rol,
      nombre: user.nombre,
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.COOKIE_SECURE === 'true',
      path: '/',
    });
    return { ok: true, message: 'Sesión cerrada' };
  }
}
