import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  private async getStanByUserId(userId: number) {
    const stan = await this.prisma.stan.findUnique({ where: { id_user: userId } });
    if (!stan) throw new NotFoundException('Stan tidak ditemukan');
    return stan;
  }

  async findAll(id_stan?: number) {
    const now = new Date();
    return this.prisma.menu.findMany({
      where: id_stan ? { id_stan } : {},
      include: {
        stan: { select: { nama_stan: true } },
        menu_diskon: {
          include: { diskon: true },
          where: { diskon: { tanggal_awal: { lte: now }, tanggal_akhir: { gte: now } } },
        },
      },
    });
  }

  async findOne(id: number) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
      include: {
        stan: { select: { nama_stan: true } },
        menu_diskon: { include: { diskon: true } },
      },
    });
    if (!menu) throw new NotFoundException('Menu tidak ditemukan');
    return menu;
  }

  async create(userId: number, dto: CreateMenuDto, foto?: string) {
    const stan = await this.getStanByUserId(userId);
    return this.prisma.menu.create({
      data: { ...dto, id_stan: stan.id, foto: foto ?? null },
    });
  }

  async update(userId: number, id: number, dto: UpdateMenuDto, foto?: string) {
    const stan = await this.getStanByUserId(userId);
    const menu = await this.prisma.menu.findUnique({ where: { id } });
    if (!menu) throw new NotFoundException('Menu tidak ditemukan');
    if (menu.id_stan !== stan.id) throw new ForbiddenException('Bukan menu stan Anda');
    return this.prisma.menu.update({
      where: { id },
      data: { ...dto, ...(foto && { foto }) },
    });
  }

  async remove(userId: number, id: number) {
    const stan = await this.getStanByUserId(userId);
    const menu = await this.prisma.menu.findUnique({ where: { id } });
    if (!menu) throw new NotFoundException('Menu tidak ditemukan');
    if (menu.id_stan !== stan.id) throw new ForbiddenException('Bukan menu stan Anda');
    await this.prisma.menu.delete({ where: { id } });
    return { message: 'Menu berhasil dihapus' };
  }
}
