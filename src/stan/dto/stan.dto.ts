import { IsOptional, IsString } from 'class-validator';

export class UpdateStanDto {
  @IsString()
  @IsOptional()
  nama_stan?: string;

  @IsString()
  @IsOptional()
  nama_pemilik?: string;

  @IsString()
  @IsOptional()
  telp?: string;
}
