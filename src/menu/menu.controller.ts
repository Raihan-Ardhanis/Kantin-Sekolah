import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MenuService } from './menu.service';
import { CreateMenuDto, UpdateMenuDto } from './dto/menu.dto';

const fotoStorage = diskStorage({
  destination: './uploads/menu',
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `menu-${unique}${extname(file.originalname)}`);
  },
});

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Roles('siswa', 'admin_stan')
  @Get()
  findAll(@Query('id_stan') id_stan?: string) {
    return this.menuService.findAll(id_stan ? +id_stan : undefined);
  }

  @Roles('siswa', 'admin_stan')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menuService.findOne(id);
  }

  @Roles('admin_stan')
  @Post()
  @UseInterceptors(FileInterceptor('foto', { storage: fotoStorage }))
  create(
    @Request() req,
    @Body() dto: CreateMenuDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.menuService.create(req.user.id, dto, file?.filename);
  }

  @Roles('admin_stan')
  @Put(':id')
  @UseInterceptors(FileInterceptor('foto', { storage: fotoStorage }))
  update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMenuDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.menuService.update(req.user.id, id, dto, file?.filename);
  }

  @Roles('admin_stan')
  @Delete(':id')
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.menuService.remove(req.user.id, id);
  }
}
