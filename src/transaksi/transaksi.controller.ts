import {
  Body, Controller, Get, Param, ParseIntPipe,
  Patch, Post, Query, Request, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TransaksiService } from './transaksi.service';
import { CreateTransaksiDto, UpdateStatusDto } from './dto/transaksi.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('transaksi')
export class TransaksiController {
  constructor(private readonly transaksiService: TransaksiService) {}

  @Roles('siswa')
  @Post()
  create(@Request() req, @Body() dto: CreateTransaksiDto) {
    return this.transaksiService.create(req.user.id, dto);
  }

  @Roles('siswa')
  @Get('history')
  getHistory(@Request() req, @Query('bulan') bulan?: string, @Query('tahun') tahun?: string) {
    return this.transaksiService.getHistory(req.user.id, bulan, tahun);
  }

  @Roles('siswa')
  @Get(':id/nota')
  getNota(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.transaksiService.findOne(req.user.id, id);
  }

  @Roles('siswa')
  @Get(':id')
  findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.transaksiService.findOne(req.user.id, id);
  }

  @Roles('admin_stan')
  @Get('admin/all')
  findAllAdmin(@Request() req, @Query('bulan') bulan?: string, @Query('tahun') tahun?: string) {
    return this.transaksiService.findAllAdmin(req.user.id, bulan, tahun);
  }

  @Roles('admin_stan')
  @Get('admin/rekap')
  getRekap(@Request() req, @Query('tahun') tahun?: string) {
    return this.transaksiService.getRekapBulanan(req.user.id, tahun);
  }

  @Roles('admin_stan')
  @Patch(':id/status')
  updateStatus(@Request() req, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStatusDto) {
    return this.transaksiService.updateStatus(req.user.id, id, dto);
  }
}
