import { StatementBank } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class UpdateStatementTermInput {
  @IsString()
  description: string;

  @IsEnum(StatementBank)
  bank: StatementBank;
}
