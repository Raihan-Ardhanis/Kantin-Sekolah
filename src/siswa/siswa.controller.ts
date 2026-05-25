import {
  Body, Controller, Delete, Get, Param, ParseIntPipe,
  Patch, Put, Request, UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SiswaService } from './siswa.service';
import { UpdateSiswaDto } from './dto/siswa.dto';

const fotoStorage = diskStorage({
  destination: './uploads/siswa',
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `siswa-${unique}${extname(file.originalname)}`);
  },
});

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('siswa')
export class SiswaController {
  constructor(private readonly siswaService: SiswaService) {}

  @Roles('siswa')
  @Get('profile')
  getMyProfile(@Request() req) {
    return this.siswaService.getMyProfile(req.user.id);
  }

  @Roles('siswa')
  @Put('profile')
  @UseInterceptors(FileInterceptor('foto', { storage: fotoStorage }))
  updateMyProfile(
    @Request() req,
    @Body() dto: UpdateSiswaDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.siswaService.updateMyProfile(req.user.id, dto, file?.filename);
  }

  @Roles('admin_stan')
  @Get()
  findAll() {
    return this.siswaService.findAll();
  }

  @Roles('admin_stan')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.siswaService.findOne(id);
  }

  @Roles('admin_stan')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSiswaDto) {
    return this.siswaService.update(id, dto);
  }

  @Roles('admin_stan')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.siswaService.remove(id);
  }
}
