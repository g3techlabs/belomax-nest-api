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
    const terms = data.terms;

    for (const term of terms) {
      const existingTerm = await this.statementTermRepository.findUnique({
        bank: term.bank,
        description: term.description,
      });

      if (existingTerm) {
        const activatedTerm = await this.statementTermRepository.activate(
          existingTerm.id,
        );

        terms.filter((t) => t.description !== activatedTerm.description);

        continue;
      }
    }

    return await this.statementTermRepository.createMany(data.terms);
  }
}
