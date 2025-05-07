import { PartialType } from "@nestjs/swagger";
import { CreateAddressInput } from "../../address/inputs/create-address.input";

export class UpdateAddressInput extends PartialType(CreateAddressInput) {}