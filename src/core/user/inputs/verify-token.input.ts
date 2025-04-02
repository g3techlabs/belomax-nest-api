import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class VerifyTokenInput {
    @IsNotEmpty()
    @IsString()
    @MaxLength(6, { message: "Must be a 6 character token" })
    @MinLength(6, { message: "Must be a 6 character token" })
    token: string
}