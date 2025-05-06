import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAddressInput {
  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsNumberString()
  number: string;

  @IsNotEmpty()
  @IsString()
  neighborhood: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  additional: string;

  @IsNotEmpty()
  @IsString()
  zipcode: string;
}
