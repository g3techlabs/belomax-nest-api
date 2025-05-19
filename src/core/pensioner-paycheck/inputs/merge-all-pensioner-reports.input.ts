import { IsNotEmpty, IsString } from "class-validator";

export class MergeAllPensionerReportsInput {
    @IsNotEmpty()
    @IsString()
    customerId: string
}