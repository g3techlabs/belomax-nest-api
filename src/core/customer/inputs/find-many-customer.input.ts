import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindManyCustomerInput {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  cpf?: string;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}
