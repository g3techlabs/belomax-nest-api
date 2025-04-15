import { PickType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { WelcomeInput } from "src/infrastructure/mail/input/welcome.input";

export class SetPasswordInput extends PickType(WelcomeInput, ['setPasswordToken']) {
    @IsNotEmpty()
    password: string
}