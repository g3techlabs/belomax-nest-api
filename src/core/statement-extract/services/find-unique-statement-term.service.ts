import { Injectable } from '@nestjs/common';
import { StatementTermRepository } from '../repositories/statement-term.repository';
import { StatementTerm } from '@prisma/client';
import { FindUniqueStatementTermInput } from '../inputs/find-unique-statement-term.input';

@Injectable()
export class FindUniqueStatementTermService {
  constructor(
    private readonly statementTermRepository: StatementTermRepository,
  ) {}

  async execute(
    data: FindUniqueStatementTermInput,
  ): Promise<StatementTerm | null> {
    return await this.statementTermRepository.findUnique(data);
  }
}
