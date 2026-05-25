import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterSiswaDto {
  @IsString()
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  username: string;

  @IsString()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Nama siswa tidak boleh kosong' })
  nama_siswa: string;

  @IsString()
  @IsOptional()
  alamat?: string;

  @IsString()
  @IsOptional()
  telp?: string;
}

export class RegisterStanDto {
  @IsString()
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  username: string;

  @IsString()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Nama stan tidak boleh kosong' })
  nama_stan: string;

  @IsString()
  @IsNotEmpty({ message: 'Nama pemilik tidak boleh kosong' })
  nama_pemilik: string;

  @IsString()
  @IsOptional()
  telp?: string;
}
