import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateStanDto } from './dto/stan.dto';

@Injectable()
export class StanService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.stan.findMany({
      include: { user: { select: { username: true } } },
    });
  }

  async findOne(id: number) {
    const stan = await this.prisma.stan.findUnique({
      where: { id },
      include: { menu: true, user: { select: { username: true } } },
    });
    if (!stan) throw new NotFoundException('Stan tidak ditemukan');
    return stan;
  }

  async getMyProfile(userId: number) {
    const stan = await this.prisma.stan.findUnique({
      where: { id_user: userId },
      include: { user: { select: { username: true, role: true } } },
    });
    if (!stan) throw new NotFoundException('Profil stan tidak ditemukan');
    return stan;
  }

  async updateMyProfile(userId: number, dto: UpdateStanDto) {
    const stan = await this.prisma.stan.findUnique({ where: { id_user: userId } });
    if (!stan) throw new NotFoundException('Profil stan tidak ditemukan');
    return this.prisma.stan.update({ where: { id_user: userId }, data: dto });
  }
}
