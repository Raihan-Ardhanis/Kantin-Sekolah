import { Body, Controller, Get, Param, ParseIntPipe, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { StanService } from './stan.service';
import { UpdateStanDto } from './dto/stan.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('stan')
export class StanController {
  constructor(private readonly stanService: StanService) {}

  @Roles('siswa', 'admin_stan')
  @Get()
  findAll() {
    return this.stanService.findAll();
  }

  @Roles('siswa', 'admin_stan')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.stanService.findOne(id);
  }

  @Roles('admin_stan')
  @Get('admin/profile')
  getMyProfile(@Request() req) {
    return this.stanService.getMyProfile(req.user.id);
  }

  @Roles('admin_stan')
  @Put('admin/profile')
  updateMyProfile(@Request() req, @Body() dto: UpdateStanDto) {
    return this.stanService.updateMyProfile(req.user.id, dto);
  }
}
