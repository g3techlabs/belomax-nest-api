import { IsOptional, IsString, IsDate } from 'class-validator';

export class FindManyPensionerPaycheckInput {
  @IsString()
  @IsOptional()
  customerId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsDate()
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @IsOptional()
  endDate?: Date;
}
