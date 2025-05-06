/* eslint-disable */
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { CreateAddressInput } from '../../address/inputs/create-address.input';
import { Transform, Type } from 'class-transformer';

export class CreateCustomerInput {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  cpfCnpj: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  rg?: string;

  @Type(() => CreateAddressInput)
  @IsOptional()
  address?: CreateAddressInput;

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
