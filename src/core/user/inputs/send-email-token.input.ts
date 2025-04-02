import { IsEmail, IsNotEmpty } from "class-validator";

export class SendTokenEmailInput {
    @IsNotEmpty()
    @IsEmail()
    email: string
}