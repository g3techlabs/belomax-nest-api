import { IsNumber, IsString } from 'class-validator';

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
  initialMonth: number;

  @IsNumber()
  initialYear: number;

  @IsNumber()
  finalMonth: number;

  @IsNumber()
  finalYear: number;
}
