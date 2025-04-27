import { Injectable } from '@nestjs/common';
import { StatementTermRepository } from '../repositories/statement-term.repository';
import { StatementTerm } from '@prisma/client';
import { FindManyStatementTermInput } from '../inputs/find-many-statement-term.input';

@Injectable()
export class FindManyStatementTermService {
  constructor(
    private readonly statementTermRepository: StatementTermRepository,
  ) {}

  async execute(data: FindManyStatementTermInput): Promise<StatementTerm[]> {
    return await this.statementTermRepository.findMany(data);
  }
}
