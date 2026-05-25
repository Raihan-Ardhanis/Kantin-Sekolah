import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'kantin_secret_key_ukk2026',
    });
  }

  async validate(payload: { sub: number; username: string; role: string }) {
    const user = await this.prisma.users.findUnique({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException('Token tidak valid');
    return { id: user.id, username: user.username, role: user.role };
  }
}
