import { Injectable } from '@nestjs/common';
import { StatementTermRepository } from '../repositories/statement-term.repository';

@Injectable()
export class ToggleStatementTermService {
  constructor(
    private readonly statementTermRepository: StatementTermRepository,
  ) {}

  async execute(id: string) {
    const statementTerm = await this.statementTermRepository.findById(id);

    if (!statementTerm) {
      throw new Error('Termo não encontrado');
    }

    if (statementTerm.active) {
      return await this.statementTermRepository.deactivate(id);
    } else if (!statementTerm.active) {
      return await this.statementTermRepository.activate(id);
    }
  }
}
