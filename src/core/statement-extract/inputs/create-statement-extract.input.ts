import { IsEnum, IsArray, IsString, IsOptional } from 'class-validator';
import { StatementBank } from '@prisma/client';

export class CreateStatementExtractRequestInput {
  @IsEnum(StatementBank)
  bank: StatementBank;

  @IsArray()
  selectedTerms: string[]; // Array of StatementTerm IDs

  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateStatementExtractServiceInput {
  bank: StatementBank;
  selectedTerms: string[];
  description?: string;
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
