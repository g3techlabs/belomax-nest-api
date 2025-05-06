import { PartialType } from "@nestjs/swagger";
import { CreateAddressInput } from "../../address/inputs/create-address.input";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateAddressInput extends PartialType(CreateAddressInput) {
    @IsNotEmpty()
    @IsString()
    id: string
}