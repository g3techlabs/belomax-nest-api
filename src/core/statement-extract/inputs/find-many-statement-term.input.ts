import { IsOptional, IsString } from 'class-validator';

export class FindManyStatementTermInput {
  @IsString()
  @IsOptional()
  description?: string;
}
