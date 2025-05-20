import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { CreateStatementExtractDataInput } from '../inputs/create-statement-extract.input';
import { UpdateStatementExtractInput } from '../inputs/update-statement-extract.input';
import { StatementExtract } from '@prisma/client';
import { FindManyStatementExtractInput } from '../inputs/find-many-statement-extract.input';

@Injectable()
export class StatementExtractRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateStatementExtractDataInput) {
    return await this.prisma.statementExtract.create({
      data: {
        automationId: data.automationId,
        bank: data.bank,
        selectedTerms: {
          create: data.selectedTerms.map((termId) => ({
            statementTermId: termId,
          })),
        },
      },
      include: {
        selectedTerms: {
          include: {
            statementTerm: true,
          },
        },
        automation: {
          include: {
            documents: true,
            customer: true,
            user: true,
            statementExtract: {
              include: {
                selectedTerms: {
                  include: {
                    statementTerm: true,
                  },
                },
              },
            },
            pensionerPaycheck: {
              include: {
                terms: true,
              },
            },
          },
        },
      },
    });
  }

  async findMany(
    data: FindManyStatementExtractInput,
  ): Promise<StatementExtract[]> {
    return await this.prisma.statementExtract.findMany({
      where: {
        createdAt: data.dateInterval
          ? {
              gte: data.dateInterval.start,
              lte: data.dateInterval.end,
            }
          : undefined,
        automation: {
          description: data.description
            ? {
                contains: data.description,
                mode: 'insensitive',
              }
            : undefined,
          customerId: data.customerId ? data.customerId : undefined,
          userId: data.userId ? data.userId : undefined,
          status: data.status ? data.status : undefined,
        },
        selectedTerms: {
          some: {
            statementTerm: {
              description: data.term
                ? {
                    contains: data.term,
                    mode: 'insensitive',
                  }
                : undefined,
            },
          },
        },
      },
      include: {
        selectedTerms: {
          include: {
            statementTerm: true,
          },
        },
        automation: {
          include: {
            documents: true,
            customer: true,
            user: true,
            statementExtract: {
              include: {
                selectedTerms: true,
              },
            },
            pensionerPaycheck: {
              include: {
                terms: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<StatementExtract | null> {
    return await this.prisma.statementExtract.findUnique({
      where: { id },
      include: {
        automation: {
          include: {
            documents: true,
            customer: true,
            user: true,
            statementExtract: {
              include: {
                selectedTerms: true,
              },
            },
            pensionerPaycheck: {
              include: {
                terms: true,
              },
            },
          },
        },
        selectedTerms: {
          include: {
            statementTerm: true,
          },
        },
      },
    });
  }

  async update(
    id: string,
    data: UpdateStatementExtractInput,
  ): Promise<StatementExtract> {
    return await this.prisma.statementExtract.update({
      where: { id },
      data: {
        bank: data.bank,
        selectedTerms: data.selectedTerms
          ? {
              deleteMany: {},
              create: data.selectedTerms.map((termId) => ({
                statementTermId: termId,
              })),
            }
          : undefined,
      },
    });
  }

  async findStatementExtractByAutomationId(automationId: string) {
    return await this.prisma.statementExtract.findFirst({
      where: {
        automationId,
      },
      include: {
        selectedTerms: {
          include: {
            statementTerm: true,
          },
        },
        automation: {
          include: {
            documents: true,
            customer: true,
            user: true,
            statementExtract: {
              include: {
                selectedTerms: true,
              },
            },
            pensionerPaycheck: {
              include: {
                terms: true,
              },
            },
          },
        },
      },
    });
  }
}
