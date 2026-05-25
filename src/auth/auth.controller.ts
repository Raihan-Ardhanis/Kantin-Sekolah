import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterSiswaDto, RegisterStanDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/siswa')
  registerSiswa(@Body() dto: RegisterSiswaDto) {
    return this.authService.registerSiswa(dto);
  }

  @Post('register/stan')
  registerStan(@Body() dto: RegisterStanDto) {
    return this.authService.registerStan(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
