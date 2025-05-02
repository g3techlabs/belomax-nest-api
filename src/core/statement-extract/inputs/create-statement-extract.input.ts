/* eslint-disable */
import { IsEnum, IsArray, IsString, IsOptional } from 'class-validator';
import { StatementBank } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateStatementExtractRequestInput {
  @IsEnum(StatementBank)
  bank: StatementBank;

  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return [value];
      }
    }
    return value;
  })
  selectedTerms: string[];

  @IsString()
  @IsOptional()
  description?: string;

  // @IsString()
  // customerId: string;
}

export class CreateStatementExtractServiceInput {
  bank: StatementBank;
  selectedTerms: string[];
  description?: string;
  userId: string;
  file: Express.Multer.File;
  token: string;
  // customerId: string;
}

export class CreateStatementExtractDataInput {
  automationId: string;
  userId: string;
  bank: StatementBank;
  selectedTerms: string[];
  // customerId: string;
}
