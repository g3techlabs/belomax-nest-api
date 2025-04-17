import { Injectable, NotFoundException } from '@nestjs/common';
import { StatementExtractRepository } from '../repositories/statement-extract.repository';
import { StatementExtract } from '@prisma/client';

@Injectable()
export class FindByIdStatementExtractService {
  constructor(
    private readonly statementExtractRepository: StatementExtractRepository,
  ) {}

  async execute(id: string): Promise<StatementExtract> {
    const statementExtract = await this.statementExtractRepository.findById(id);
    if (!statementExtract) {
      throw new NotFoundException(`StatementExtract with ID ${id} not found`);
    }
    return statementExtract;
  }
}
