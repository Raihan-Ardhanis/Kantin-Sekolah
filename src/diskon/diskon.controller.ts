import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DiskonService } from './diskon.service';
import { CreateDiskonDto, UpdateDiskonDto } from './dto/diskon.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('diskon')
export class DiskonController {
  constructor(private readonly diskonService: DiskonService) {}

  @Roles('siswa', 'admin_stan')
  @Get()
  findAll() { return this.diskonService.findAll(); }

  @Roles('siswa', 'admin_stan')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.diskonService.findOne(id); }

  @Roles('admin_stan')
  @Post()
  create(@Body() dto: CreateDiskonDto) { return this.diskonService.create(dto); }

  @Roles('admin_stan')
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDiskonDto) {
    return this.diskonService.update(id, dto);
  }

  @Roles('admin_stan')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.diskonService.remove(id); }
}
