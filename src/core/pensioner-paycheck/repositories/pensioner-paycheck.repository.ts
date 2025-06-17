import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { CreatePensionerPaycheckInput } from '../inputs/create-pensioner-paycheck.input';
import { FindManyPensionerPaycheckInput } from '../inputs/find-many-pensioner-paycheck.input';
import { FindExistingPensionerPaycheckInput } from '../inputs/find-existing-pensioner-paycheck.input';
import { PensionerPaycheck } from '../entities/pensioner-paycheck';
import { MergeAllPensionerReportsInput } from '../inputs/merge-all-pensioner-reports.input';
import { AutomationStatus } from '@prisma/client';

@Injectable()
export class PensionerPaycheckRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePensionerPaycheckInput) {
    const {
      registration,
      bond,
      cpf,
      pensionerNumber,
      month,
      year,
      consignableMargin,
      totalBenefits,
      netToReceive,
      automationId,
      terms,
    } = data;

    try {
      const createdPaycheck = await this.prisma.pensionerPaycheck.create({
        data: {
          registration,
          bond,
          cpf,
          pensionerNumber,
          month,
          year,
          consignableMargin,
          totalBenefits,
          netToReceive,
          automationId,
          terms: {
            create: terms.map((term) => ({
              code: term.code,
              discrimination: term.discrimination,
              value: term.value,
              type: term.type,
              month: term.month,
              year: term.year,
            })),
          },
        },
        include: {
          terms: true,
          automation: {
            include: {
              customer: true,
              user: true,
              documents: true,
            },
          },
        },
      });

      return createdPaycheck;
    } catch (error) {
      console.error('❌ Erro ao criar contracheque:', error);
      throw error;
    }
  }

  async findById(id: string) {
    return await this.prisma.pensionerPaycheck.findUnique({
      where: { id },
      include: {
        automation: {
          include: {
            customer: true,
            user: true,
            documents: true,
          },
        },
        terms: true,
      },
    });
  }

  async findMany(
    data: FindManyPensionerPaycheckInput,
  ): Promise<PensionerPaycheck[]> {
    const {
      discrimination,
      code,
      type,
      minValue,
      maxValue,
      minConsignableMargin,
      maxConsignableMargin,
      minNetToReceive,
      maxNetToReceive,
      initialMonth,
      initialYear,
      finalMonth,
      finalYear,
      customerId,
      userId,
      status,
    } = data;

    return await this.prisma.pensionerPaycheck.findMany({
      where: {
        terms: {
          some: {
            discrimination: { contains: discrimination },
            code,
            type,
            value: { gte: minValue, lte: maxValue },
          },
        },
        consignableMargin: {
          gte: minConsignableMargin,
          lte: maxConsignableMargin,
        },
        netToReceive: { gte: minNetToReceive, lte: maxNetToReceive },
        ...(customerId && { automation: { customerId } }),
        ...(userId && { automation: { userId } }),
        ...(status && { automation: { status } }),
        AND: [
          {
            year: initialYear,
            month: { gte: initialMonth },
          },
          {
            year: finalYear,
            month: { lte: finalMonth },
          },
          {
            year: { gte: initialYear, lte: finalYear },
          },
        ],
      },
      include: {
        automation: {
          include: {
            customer: true,
            user: true,
            documents: true,
          },
        },
        terms: true,
      },
      orderBy: [{ month: 'desc' }, { year: 'desc' }],
    });
  }

  async findExistingPensionerPaycheck(
    data: FindExistingPensionerPaycheckInput,
  ) {
    const { customerId, month, year } = data;

    return await this.prisma.pensionerPaycheck.findFirst({
      where: {
        automation: {
          customerId,
          status: AutomationStatus.FINISHED,
        },
        month,
        year,
      },
    });
  }

  async findManyOrderedFromDate(
    data: MergeAllPensionerReportsInput,
  ): Promise<PensionerPaycheck[]> {
    const { customerId, initialMonth, initialYear, finalMonth, finalYear } =
      data;

    return await this.prisma.pensionerPaycheck.findMany({
      where: {
        ...(customerId && { automation: { customerId } }),
        automation: {
          status: AutomationStatus.FINISHED,
        },
        AND: [
          {
            year: initialYear,
            month: { gte: initialMonth },
          },
          {
            year: finalYear,
            month: { lte: finalMonth },
          },
          {
            year: { gte: initialYear, lte: finalYear },
          },
        ],
      },
      include: {
        automation: {
          include: {
            customer: true,
            user: true,
            documents: true,
          },
        },
        terms: true,
      },
      orderBy: [{ month: 'asc' }, { year: 'asc' }],
    });
  }
}
