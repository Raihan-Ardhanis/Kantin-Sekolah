import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDiskonDto, UpdateDiskonDto } from './dto/diskon.dto';

@Injectable()
export class DiskonService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.diskon.findMany({
      include: {
        menu_diskon: { include: { menu: { select: { nama_makanan: true, harga: true } } } },
      },
    });
  }

  async findOne(id: number) {
    const diskon = await this.prisma.diskon.findUnique({
      where: { id },
      include: { menu_diskon: { include: { menu: true } } },
    });
    if (!diskon) throw new NotFoundException('Diskon tidak ditemukan');
    return diskon;
  }

  async create(dto: CreateDiskonDto) {
    const { id_menu, ...data } = dto;
    return this.prisma.diskon.create({
      data: {
        ...data,
        tanggal_awal: new Date(dto.tanggal_awal),
        tanggal_akhir: new Date(dto.tanggal_akhir),
        menu_diskon: id_menu ? { create: id_menu.map((id) => ({ id_menu: id })) } : undefined,
      },
      include: { menu_diskon: true },
    });
  }

  async update(id: number, dto: UpdateDiskonDto) {
    await this.findOne(id);
    const { id_menu, ...data } = dto;
    if (id_menu) await this.prisma.menu_diskon.deleteMany({ where: { id_diskon: id } });
    return this.prisma.diskon.update({
      where: { id },
      data: {
        ...data,
        ...(dto.tanggal_awal && { tanggal_awal: new Date(dto.tanggal_awal) }),
        ...(dto.tanggal_akhir && { tanggal_akhir: new Date(dto.tanggal_akhir) }),
        ...(id_menu && { menu_diskon: { create: id_menu.map((mid) => ({ id_menu: mid })) } }),
      },
      include: { menu_diskon: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.menu_diskon.deleteMany({ where: { id_diskon: id } });
    await this.prisma.diskon.delete({ where: { id } });
    return { message: 'Diskon berhasil dihapus' };
  }
}
