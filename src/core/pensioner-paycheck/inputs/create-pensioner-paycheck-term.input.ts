import { IsEnum, IsInt, IsNumber, IsString } from 'class-validator';

export class CreatePensionerPaycheckTermInput {
  @IsNumber()
  month: number;

  @IsNumber()
  year: number;

  @IsEnum(['BENEFIT', 'DISCOUNT'])
  @IsString()
  type: 'BENEFIT' | 'DISCOUNT';

  @IsNumber()
  @IsInt()
  code: number;

  @IsString()
  discrimination: string;

  @IsNumber()
  value: number;
}
