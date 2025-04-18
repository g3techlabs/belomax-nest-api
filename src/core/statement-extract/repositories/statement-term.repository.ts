import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { CreateStatementTermInput } from '../inputs/create-statement-terms.input';
import { StatementTerm } from '@prisma/client';
import { FindUniqueStatementTermInput } from '../inputs/find-unique-statement-term.input';

@Injectable()
export class StatementTermRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<StatementTerm | null> {
    return await this.prisma.statementTerm.findUnique({
      where: { id },
    });
  }

  async findUnique({ bank, description }: FindUniqueStatementTermInput) {
    return await this.prisma.statementTerm.findFirst({
      where: {
        AND: [
          {
            bank,
          },
          {
            description,
          },
        ],
      },
    });
  }

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
