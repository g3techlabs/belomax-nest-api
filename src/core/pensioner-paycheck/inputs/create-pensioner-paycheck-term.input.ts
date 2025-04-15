import { IsEnum, IsInt, IsNumber, IsString } from 'class-validator';

export class CreatePensionerPaycheckTermInput {
  @IsString()
  month: string;

  @IsString()
  year: string;

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
