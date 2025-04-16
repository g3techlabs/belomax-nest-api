import { StatementBank } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class FindUniqueStatementTermInput {
  @IsString()
  description: string;

  @IsEnum(StatementBank)
  bank: StatementBank;
}
