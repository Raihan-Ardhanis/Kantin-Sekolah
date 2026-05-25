import { IsOptional, IsString } from 'class-validator';

export class UpdateSiswaDto {
  @IsString()
  @IsOptional()
  nama_siswa?: string;

  @IsString()
  @IsOptional()
  alamat?: string;

  @IsString()
  @IsOptional()
  telp?: string;
}
