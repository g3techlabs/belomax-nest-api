import { IsArray, IsBoolean, IsEnum, IsString } from 'class-validator';
import { StatementBank } from '@prisma/client';

export class CreateStatementTermInput {
  @IsString()
  description: string;

  @IsEnum(StatementBank)
  bank: StatementBank;

  @IsBoolean()
  active: boolean;
}

export class CreateStatementTermsInput {
  @IsArray()
  terms: CreateStatementTermInput[];
}
