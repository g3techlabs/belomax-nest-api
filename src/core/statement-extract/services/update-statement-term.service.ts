import { Injectable, NotFoundException } from '@nestjs/common';
import { StatementTermRepository } from '../repositories/statement-term.repository';
import { UpdateStatementTermInput } from '../inputs/update-statement-term.input';
import { StatementTerm } from '@prisma/client';

@Injectable()
export class UpdateStatementTermService {
  constructor(
    private readonly statementTermRepository: StatementTermRepository,
  ) {}

  async execute(
    id: string,
    data: UpdateStatementTermInput,
  ): Promise<StatementTerm> {
    const existingTerm = await this.statementTermRepository.findById(id);

    if (!existingTerm) {
      throw new NotFoundException('Statement term not found');
    }

    const findUniqueTerm = await this.statementTermRepository.findUnique({
      bank: data.bank,
      description: data.description,
    });

    if (findUniqueTerm && findUniqueTerm.id !== id) {
      throw new NotFoundException('Statement term already exists');
    }

    return await this.statementTermRepository.update(id, data);
  }
}
