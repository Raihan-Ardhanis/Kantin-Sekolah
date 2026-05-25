import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransaksiDto, UpdateStatusDto } from './dto/transaksi.dto';

@Injectable()
export class TransaksiService {
  constructor(private prisma: PrismaService) {}

  private async getSiswa(userId: number) {
    const siswa = await this.prisma.siswa.findUnique({ where: { id_user: userId } });
    if (!siswa) throw new NotFoundException('Data siswa tidak ditemukan');
    return siswa;
  }

  private async getStan(userId: number) {
    const stan = await this.prisma.stan.findUnique({ where: { id_user: userId } });
    if (!stan) throw new NotFoundException('Data stan tidak ditemukan');
    return stan;
  }

  async create(userId: number, dto: CreateTransaksiDto) {
    const siswa = await this.getSiswa(userId);
    const now = new Date();

    const details = await Promise.all(
      dto.items.map(async (item) => {
        const menu = await this.prisma.menu.findUnique({
          where: { id: item.id_menu },
          include: {
            menu_diskon: {
              include: { diskon: true },
              where: { diskon: { tanggal_awal: { lte: now }, tanggal_akhir: { gte: now } } },
            },
          },
        });
        if (!menu) throw new BadRequestException(`Menu id ${item.id_menu} tidak ditemukan`);
        if (menu.id_stan !== dto.id_stan)
          throw new BadRequestException(`Menu ${menu.nama_makanan} bukan dari stan yang dipilih`);

        let harga = menu.harga;
        if (menu.menu_diskon.length > 0) {
          const maxDiskon = Math.max(...menu.menu_diskon.map((md) => md.diskon.persentase_diskon));
          harga = harga - (harga * maxDiskon) / 100;
        }

        return { id_menu: item.id_menu, qty: item.qty, harga_beli: harga };
      }),
    );

    return this.prisma.transaksi.create({
      data: {
        id_stan: dto.id_stan,
        id_siswa: siswa.id,
        detail_transaksi: { create: details },
      },
      include: {
        detail_transaksi: { include: { menu: true } },
        stan: { select: { nama_stan: true } },
      },
    });
  }

  async getHistory(userId: number, bulan?: string, tahun?: string) {
    const siswa = await this.getSiswa(userId);
    const where: any = { id_siswa: siswa.id };
    if (bulan && tahun) {
      const start = new Date(+tahun, +bulan - 1, 1);
      const end = new Date(+tahun, +bulan, 1);
      where.tanggal = { gte: start, lt: end };
    }
    return this.prisma.transaksi.findMany({
      where,
      include: {
        stan: { select: { nama_stan: true } },
        detail_transaksi: { include: { menu: { select: { nama_makanan: true } } } },
      },
      orderBy: { tanggal: 'desc' },
    });
  }

  async findOne(userId: number, id: number) {
    const siswa = await this.getSiswa(userId);
    const transaksi = await this.prisma.transaksi.findUnique({
      where: { id },
      include: { stan: true, siswa: true, detail_transaksi: { include: { menu: true } } },
    });
    if (!transaksi) throw new NotFoundException('Transaksi tidak ditemukan');
    if (transaksi.id_siswa !== siswa.id) throw new ForbiddenException('Bukan transaksi Anda');
    const total = transaksi.detail_transaksi.reduce((sum, d) => sum + d.harga_beli * d.qty, 0);
    return { ...transaksi, total };
  }

  async findAllAdmin(userId: number, bulan?: string, tahun?: string) {
    const stan = await this.getStan(userId);
    const where: any = { id_stan: stan.id };
    if (bulan && tahun) {
      const start = new Date(+tahun, +bulan - 1, 1);
      const end = new Date(+tahun, +bulan, 1);
      where.tanggal = { gte: start, lt: end };
    }
    return this.prisma.transaksi.findMany({
      where,
      include: {
        siswa: { select: { nama_siswa: true, telp: true } },
        detail_transaksi: { include: { menu: { select: { nama_makanan: true } } } },
      },
      orderBy: { tanggal: 'desc' },
    });
  }

  async updateStatus(userId: number, id: number, dto: UpdateStatusDto) {
    const stan = await this.getStan(userId);
    const transaksi = await this.prisma.transaksi.findUnique({ where: { id } });
    if (!transaksi) throw new NotFoundException('Transaksi tidak ditemukan');
    if (transaksi.id_stan !== stan.id) throw new ForbiddenException('Bukan pesanan stan Anda');
    return this.prisma.transaksi.update({ where: { id }, data: { status: dto.status as any } });
  }

  async getRekapBulanan(userId: number, tahun?: string) {
    const stan = await this.getStan(userId);
    const targetTahun = tahun ? +tahun : new Date().getFullYear();
    const start = new Date(targetTahun, 0, 1);
    const end = new Date(targetTahun + 1, 0, 1);

    const transaksi = await this.prisma.transaksi.findMany({
      where: { id_stan: stan.id, status: 'sampai', tanggal: { gte: start, lt: end } },
      include: { detail_transaksi: true },
    });

    const rekap = Array.from({ length: 12 }, (_, i) => ({
      bulan: i + 1,
      nama_bulan: new Date(targetTahun, i, 1).toLocaleString('id-ID', { month: 'long' }),
      total_transaksi: 0,
      total_pemasukan: 0,
    }));

    transaksi.forEach((t) => {
      const bulan = new Date(t.tanggal).getMonth();
      const total = t.detail_transaksi.reduce((sum, d) => sum + d.harga_beli * d.qty, 0);
      rekap[bulan].total_transaksi += 1;
      rekap[bulan].total_pemasukan += total;
    });

    return { tahun: targetTahun, rekap };
  }
}
