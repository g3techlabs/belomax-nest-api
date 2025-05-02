import { IsDate, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateCustomerInput {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  cpf_cnpj?: string;

  @IsString()
  @IsOptional()
  rg?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  citizenship?: string;

  @IsString()
  @IsOptional()
  maritalStatus?: string;

  @IsDate()
  @IsOptional()
  birthDate?: Date;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  occupation?: string;
}
