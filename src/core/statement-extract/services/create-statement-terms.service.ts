import { Injectable } from '@nestjs/common';
import { StatementTermRepository } from '../repositories/statement-term.repository';
import { CreateStatementTermsInput } from '../inputs/create-statement-terms.input';
import { StatementTerm } from '@prisma/client';

@Injectable()
export class CreateStatementTermsService {
  constructor(
    private readonly statementTermRepository: StatementTermRepository,
  ) {}

  async execute(data: CreateStatementTermsInput): Promise<StatementTerm[]> {
    return await this.statementTermRepository.createMany(data.terms);
  }
}
