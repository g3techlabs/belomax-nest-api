import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { CreateStatementTermInput } from '../inputs/create-statement-terms.input';
import { StatementTerm } from '@prisma/client';

@Injectable()
export class StatementTermRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(
    terms: CreateStatementTermInput[],
  ): Promise<StatementTerm[]> {
    const createdTerms: StatementTerm[] = [];

    for (const term of terms) {
      const existingTerm = await this.prisma.statementTerm.findFirst({
        where: {
          AND: [
            {
              bank: term.bank,
            },
            {
              description: term.description,
            },
          ],
        },
      });

      if (!existingTerm) {
        const newTerm = await this.prisma.statementTerm.create({
          data: term,
        });
        createdTerms.push(newTerm);
      }
    }
    return createdTerms;
  }
}
