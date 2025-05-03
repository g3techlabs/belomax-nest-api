import { IsBoolean, IsNotEmpty } from "class-validator";

export class UpdateActiveStatusRequestInput {
    @IsNotEmpty()
    @IsBoolean()
    active: boolean
}