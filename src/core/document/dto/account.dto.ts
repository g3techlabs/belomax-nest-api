import { IsNotEmpty, IsString } from "class-validator";

export class Account {
  @IsNotEmpty()
  @IsString()
  number: string;

  @IsNotEmpty()
  @IsString()
  agency: string;
}