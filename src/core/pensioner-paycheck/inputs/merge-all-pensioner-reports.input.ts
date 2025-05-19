import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MergeAllPensionerReportsInput {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsNumber()
  initialMonth: number;

  @IsNotEmpty()
  @IsNumber()
  initialYear: number;

  @IsNotEmpty()
  @IsNumber()
  finalMonth: number;

  @IsNotEmpty()
  @IsNumber()
  finalYear: number;
}
