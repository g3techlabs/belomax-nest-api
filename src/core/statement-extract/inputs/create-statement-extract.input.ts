import { IsEnum, IsArray } from 'class-validator';
import { StatementBank } from '@prisma/client';

export class CreateStatementExtractRequestInput {
  @IsEnum(StatementBank)
  bank: StatementBank;

  @IsArray()
  selectedTerms: string[]; // Array of StatementTerm IDs
}

export class CreateStatementExtractServiceInput {
  bank: StatementBank;
  selectedTerms: string[];
  userId: string;
  file: Express.Multer.File;
  token: string;
}

export class CreateStatementExtractDataInput {
  automationId: string;
  userId: string;
  bank: StatementBank;
  selectedTerms: string[];
}
