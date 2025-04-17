import { Injectable } from '@nestjs/common';
import { StatementExtractRepository } from '../repositories/statement-extract.repository';
import { StatementExtract } from '@prisma/client';

@Injectable()
export class FindManyStatementExtractService {
  constructor(
    private readonly statementExtractRepository: StatementExtractRepository,
  ) {}

  async execute(): Promise<StatementExtract[]> {
    return await this.statementExtractRepository.findMany();
  }
}
