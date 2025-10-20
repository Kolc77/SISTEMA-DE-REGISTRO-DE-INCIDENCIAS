import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  @UseGuards(JwtAuthGuard)
  @Get('auth/me')
  me(@Req() req: any) {
    return { ok: true, userId: req.user.userId, role: req.user.role };
  }
}
