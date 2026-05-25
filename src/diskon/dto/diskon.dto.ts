import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDiskonDto {
  @IsString()
  @IsNotEmpty()
  nama_diskon: string;

  @Type(() => Number)
  @IsNumber()
  persentase_diskon: number;

  @IsDateString()
  tanggal_awal: string;

  @IsDateString()
  tanggal_akhir: string;

  @IsArray()
  @IsOptional()
  id_menu?: number[];
}

export class UpdateDiskonDto {
  @IsString()
  @IsOptional()
  nama_diskon?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  persentase_diskon?: number;

  @IsDateString()
  @IsOptional()
  tanggal_awal?: string;

  @IsDateString()
  @IsOptional()
  tanggal_akhir?: string;

  @IsArray()
  @IsOptional()
  id_menu?: number[];
}
