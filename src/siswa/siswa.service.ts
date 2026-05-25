import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSiswaDto } from './dto/siswa.dto';

@Injectable()
export class SiswaService {
  constructor(private prisma: PrismaService) {}

  async getMyProfile(userId: number) {
    const siswa = await this.prisma.siswa.findUnique({
      where: { id_user: userId },
      include: { user: { select: { username: true, role: true } } },
    });
    if (!siswa) throw new NotFoundException('Profil siswa tidak ditemukan');
    return siswa;
  }

  async updateMyProfile(userId: number, dto: UpdateSiswaDto, foto?: string) {
    const siswa = await this.prisma.siswa.findUnique({ where: { id_user: userId } });
    if (!siswa) throw new NotFoundException('Profil siswa tidak ditemukan');
    return this.prisma.siswa.update({
      where: { id_user: userId },
      data: { ...dto, ...(foto && { foto }) },
    });
  }

  async findAll() {
    return this.prisma.siswa.findMany({
      include: { user: { select: { username: true } } },
    });
  }

  async findOne(id: number) {
    const siswa = await this.prisma.siswa.findUnique({
      where: { id },
      include: { user: { select: { username: true } } },
    });
    if (!siswa) throw new NotFoundException('Siswa tidak ditemukan');
    return siswa;
  }

  async update(id: number, dto: UpdateSiswaDto) {
    await this.findOne(id);
    return this.prisma.siswa.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.siswa.delete({ where: { id } });
    return { message: 'Data siswa berhasil dihapus' };
  }
}
