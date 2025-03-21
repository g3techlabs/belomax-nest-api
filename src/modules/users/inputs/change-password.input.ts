import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordInput {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
