import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TriggerUniquePensionerPaycheckAutomationInput {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  registration: string;

  @IsString()
  @IsNotEmpty()
  bond: string;

  @IsNumber()
  @IsNotEmpty()
  pensionerNumber: string;

  @IsNumber()
  @IsNotEmpty()
  month: number;

  @IsNumber()
  @IsNotEmpty()
  year: number;
}
