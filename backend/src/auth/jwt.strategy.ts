import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.['access_token'],            // cookie httpOnly
        ExtractJwt.fromAuthHeaderAsBearerToken(),            // fallback
      ]),
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: { sub: number; role: string; nombre?: string }) {
    // Lo que retornes aqui va en req.user
    return { userId: payload.sub, role: payload.role, nombre: payload.nombre };
  }
}
