import { IsArray, IsEnum, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDetailDto {
  @IsInt()
  id_menu: number;

  @IsInt()
  qty: number;
}

export class CreateTransaksiDto {
  @IsInt()
  @IsNotEmpty()
  id_stan: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetailDto)
  items: CreateDetailDto[];
}

export enum StatusPesanan {
  BELUM_DIKONFIRM = 'belum_dikonfirm',
  DIMASAK = 'dimasak',
  DIANTAR = 'diantar',
  SAMPAI = 'sampai',
}

export class UpdateStatusDto {
  @IsEnum(StatusPesanan)
  status: StatusPesanan;
}
