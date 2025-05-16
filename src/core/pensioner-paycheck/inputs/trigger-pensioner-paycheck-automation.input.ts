import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TriggerUniquePensionerPaycheckAutomationInput {
  @IsString()
  customerId: string;

  @IsString()
  cpf: string;

  @IsString()
  registration: string;

  @IsString()
  bond: string;

  @IsString()
  pensionerNumber: string;

  @IsNumber()
  month: number;

  @IsNumber()
  year: number;
}
