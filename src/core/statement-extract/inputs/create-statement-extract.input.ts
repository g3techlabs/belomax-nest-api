import { IsString, IsEnum, IsArray } from 'class-validator';
import { StatementBank } from '@prisma/client';

export class CreateStatementExtractInput {
  @IsString()
  automationId: string;

  @IsEnum(StatementBank)
  bank: StatementBank;

  @IsArray()
  selectedTerms: string[]; // Array of StatementTerm IDs
}
