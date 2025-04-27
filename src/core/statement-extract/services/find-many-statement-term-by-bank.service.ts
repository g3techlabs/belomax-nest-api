import { Injectable } from '@nestjs/common';
import { StatementTermRepository } from '../repositories/statement-term.repository';
import { FindManyStatementTermByBankInput } from '../inputs/find-many-statement-term-by-bank.input';
import { StatementTerm } from '@prisma/client';

@Injectable()
export class FindManyStatementTermByBankService {
  constructor(
    private readonly statementTermRepository: StatementTermRepository,
  ) {}

  async execute(
    data: FindManyStatementTermByBankInput,
  ): Promise<StatementTerm[]> {
    return await this.statementTermRepository.findManyByBank(data);
  }
}
