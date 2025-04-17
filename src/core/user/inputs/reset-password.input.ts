import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordInput {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  tokenToReset: string;
}
