import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserInput {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(['ADMIN', 'USER'])
  @IsOptional()
  role?: string;
}
