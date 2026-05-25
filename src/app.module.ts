import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SiswaModule } from './siswa/siswa.module';
import { StanModule } from './stan/stan.module';
import { MenuModule } from './menu/menu.module';
import { DiskonModule } from './diskon/diskon.module';
import { TransaksiModule } from './transaksi/transaksi.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    SiswaModule,
    StanModule,
    MenuModule,
    DiskonModule,
    TransaksiModule,
  ],
})
export class AppModule {}
