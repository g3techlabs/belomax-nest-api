import { IsEmail, IsString } from 'class-validator';

export class UpdateUserInput {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
