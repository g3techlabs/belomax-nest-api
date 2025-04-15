import { IsEnum, IsArray, IsOptional } from 'class-validator';
import { StatementBank } from '@prisma/client';

export class UpdateStatementExtractInput {
  @IsEnum(StatementBank)
  @IsOptional()
  bank?: StatementBank;

  @IsArray()
  @IsOptional()
  selectedTerms?: string[]; // Array of StatementTerm IDs
}
