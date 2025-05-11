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

  @IsNumber()
  @IsNotEmpty()
  bond: number;

  @IsNumber()
  @IsNotEmpty()
  pensionerNumber: number;

  @IsNumber()
  @IsNotEmpty()
  month: number;

  @IsNumber()
  @IsNotEmpty()
  year: number;
}
