import { StatementBank } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class FindManyStatementTermByBankInput {
  @IsEnum(StatementBank)
  bank: StatementBank;
}
