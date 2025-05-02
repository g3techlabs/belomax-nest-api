import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class UpdateActiveStatusRequestInput {
    @IsNotEmpty()
    @IsBoolean()
    active: boolean
}

export class UpdateActiveStatusServiceInput {
    id: string
    active: boolean
}