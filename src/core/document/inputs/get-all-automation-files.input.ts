import { IsNotEmpty, IsString } from "class-validator";

export class GetAllAutomationFilesInput {
    @IsString()
    @IsNotEmpty()
    automationId: string

    @IsString()
    @IsNotEmpty()
    customerName: string
}