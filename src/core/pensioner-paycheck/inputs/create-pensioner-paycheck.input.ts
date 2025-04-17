import {
  IsArray,
  IsInstance,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreatePensionerPaycheckInput {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  customerName?: string;

  @IsString()
  registration: string;

  @IsString()
  bond: string;

  @IsString()
  @Length(11, 11)
  cpf: string;

  @IsString()
  pensionerNumber: string;

  @IsString()
  month: string;

  @IsString()
  year: string;

  @IsNumber()
  consignableMargin: number;

  @IsNumber()
  totalBenefits: number;

  @IsNumber()
  netToReceive: number;

  @IsArray()
  @IsInstance(Array<CreatePensionerPaycheckInput>)
  terms: CreatePensionerPaycheckInput[];
}
