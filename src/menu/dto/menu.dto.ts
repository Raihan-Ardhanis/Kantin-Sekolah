import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum JenisMenu {
  MAKANAN = 'makanan',
  MINUMAN = 'minuman',
}

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  nama_makanan: string;

  @Type(() => Number)
  @IsNumber()
  harga: number;

  @IsEnum(JenisMenu)
  jenis: JenisMenu;

  @IsString()
  @IsOptional()
  deskripsi?: string;
}

export class UpdateMenuDto {
  @IsString()
  @IsOptional()
  nama_makanan?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  harga?: number;

  @IsEnum(JenisMenu)
  @IsOptional()
  jenis?: JenisMenu;

  @IsString()
  @IsOptional()
  deskripsi?: string;
}
