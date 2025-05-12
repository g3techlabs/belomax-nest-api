import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePensionerPaycheckTermInput } from './create-pensioner-paycheck-term.input';

export class CreatePensionerPaycheckInput {
  @IsString()
  registration: string;

  @IsString()
  bond: string;

  @IsString()
  cpf: string;

  @IsString()
  pensionerNumber: string;

  @IsNumber()
  month: number;

  @IsNumber()
  year: number;

  @IsNumber()
  consignableMargin: number;

  @IsNumber()
  totalBenefits: number;

  @IsNumber()
  netToReceive: number;

  @IsString()
  automationId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePensionerPaycheckTermInput)
  terms: CreatePensionerPaycheckTermInput[];
}
