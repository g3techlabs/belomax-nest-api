import { Injectable, NotFoundException } from '@nestjs/common';
import { StatementTermRepository } from '../repositories/statement-term.repository';

@Injectable()
export class DeleteStatementTermService {
  constructor(
    private readonly statementTermRepository: StatementTermRepository,
  ) {}

  async execute(id: string) {
    const statementTerm = await this.statementTermRepository.findById(id);

    if (!statementTerm) {
      throw new NotFoundException('Termo não encontrado');
    }

    if (statementTerm.StatementTermsToExtract.length > 0) {
      throw new NotFoundException(
        'Não é possível excluir o termo, pois ele está vinculado a um extrato',
      );
    }

    await this.statementTermRepository.delete(id);
  }
}
