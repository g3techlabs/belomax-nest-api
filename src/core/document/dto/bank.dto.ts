import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class Bank {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  cnpj: string;

  @IsNotEmpty()
  @ValidateNested()
  address: string;
}
