import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterSiswaDto, RegisterStanDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerSiswa(dto: RegisterSiswaDto) {
    const existing = await this.prisma.users.findUnique({ where: { username: dto.username } });
    if (existing) throw new ConflictException('Username sudah digunakan');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.users.create({
      data: {
        username: dto.username,
        password: hashed,
        role: 'siswa',
        siswa: {
          create: {
            nama_siswa: dto.nama_siswa,
            alamat: dto.alamat ?? null,
            telp: dto.telp ?? null,
          },
        },
      },
    });
    return { message: 'Registrasi siswa berhasil', data: { id: user.id, username: user.username } };
  }

  async registerStan(dto: RegisterStanDto) {
    const existing = await this.prisma.users.findUnique({ where: { username: dto.username } });
    if (existing) throw new ConflictException('Username sudah digunakan');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.users.create({
      data: {
        username: dto.username,
        password: hashed,
        role: 'admin_stan',
        stan: {
          create: {
            nama_stan: dto.nama_stan,
            nama_pemilik: dto.nama_pemilik,
            telp: dto.telp ?? null,
          },
        },
      },
    });
    return { message: 'Registrasi stan berhasil', data: { id: user.id, username: user.username } };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.users.findUnique({ where: { username: dto.username } });
    if (!user) throw new UnauthorizedException('Username atau password salah');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Username atau password salah');

    const token = this.jwtService.sign({ sub: user.id, username: user.username, role: user.role });
    return { message: 'Login berhasil', data: { access_token: token, role: user.role, userId: user.id } };
  }
}
