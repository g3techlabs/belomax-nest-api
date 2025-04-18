import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FindManyDocumentInput {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}
