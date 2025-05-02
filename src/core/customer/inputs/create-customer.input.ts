import {
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateCustomerInput {
  @IsString()
  name: string;

  @IsString()
  cpf_cnpj: string;

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

  @ValidateIf((o) => o.email !== undefined && o.email !== '')
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  occupation?: string;
}
