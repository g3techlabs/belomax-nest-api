import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { CreateAutomationInput } from '../inputs/create-automation.input';
import { UpdateAutomationInput } from '../inputs/update-automation.input';
import { FindManyAutomationInput } from '../inputs/find-many-automation.input';
import { Automation, AutomationStatus } from '@prisma/client';
import { startOfMonth, startOfWeek } from 'date-fns';

@Injectable()
export class AutomationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAutomationInput) {
    const { description, userId, customerId } = data;

    return await this.prisma.automation.create({
      data: {
        description,
        user: userId
          ? {
              connect: {
                id: userId,
              },
            }
          : undefined,
        customer: customerId
          ? {
              connect: {
                id: data.customerId,
              },
            }
          : undefined,
      },
      include: {
        documents: true,
        customer: {
          include: {
            address: true,
          },
        },
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
    });
  }

  async findMany(data: FindManyAutomationInput): Promise<Automation[]> {
    const { page, limit, description, status } = data;

    return await this.prisma.automation.findMany({
      where: {
        description: description
          ? { contains: description, mode: 'insensitive' }
          : undefined,
        status: status ? { equals: status } : undefined,
      },
      take: limit || undefined,
      skip: page && limit ? (page - 1) * limit : undefined,
      include: {
        documents: true,
        customer: {
          include: {
            address: true,
          },
        },
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    return await this.prisma.automation.findUnique({
      where: { id },
      include: {
        documents: true,
        customer: {
          include: {
            address: true,
          },
        },
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
    });
  }

  async update(id: string, data: UpdateAutomationInput): Promise<Automation> {
    return await this.prisma.automation.update({
      where: { id },
      data,
    });
  }

  async changeStatus(
    id: string,
    status: AutomationStatus,
  ): Promise<Automation> {
    return await this.prisma.automation.update({
      where: { id },
      data: { status },
      include: {
        documents: true,
        customer: {
          include: {
            address: true,
          },
        },
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
    });
  }

  async getAutomationStats() {
    const totalAutomations = await this.prisma.automation.count();
    const automationsThisMonth = await this.prisma.automation.count({
      where: { createdAt: { gte: startOfMonth(new Date()) } },
    });
    const automationsThisWeek = await this.prisma.automation.count({
      where: { createdAt: { gte: startOfWeek(new Date()) } },
    });

    return { totalAutomations, automationsThisMonth, automationsThisWeek };
  }

  async getStatementExtractStats() {
    const totalStatementExtracts = await this.prisma.statementExtract.count();
    const statementExtractsThisMonth = await this.prisma.statementExtract.count(
      {
        where: { createdAt: { gte: startOfMonth(new Date()) } },
      },
    );
    const statementExtractsThisWeek = await this.prisma.statementExtract.count({
      where: { createdAt: { gte: startOfWeek(new Date()) } },
    });

    return {
      totalStatementExtracts,
      statementExtractsThisMonth,
      statementExtractsThisWeek,
    };
  }

  async getDocumentStats() {
    const totalDocuments = await this.prisma.document.count();
    const documentsThisMonth = await this.prisma.document.count({
      where: { createdAt: { gte: startOfMonth(new Date()) } },
    });
    const documentsThisWeek = await this.prisma.document.count({
      where: { createdAt: { gte: startOfWeek(new Date()) } },
    });

    return { totalDocuments, documentsThisMonth, documentsThisWeek };
  }

  async getCustomerStats() {
    const totalCustomers = await this.prisma.customer.count();
    const customersThisMonth = await this.prisma.customer.count({
      where: { createdAt: { gte: startOfMonth(new Date()) } },
    });
    const customersThisWeek = await this.prisma.customer.count({
      where: { createdAt: { gte: startOfWeek(new Date()) } },
    });

    return { totalCustomers, customersThisMonth, customersThisWeek };
  }
}
