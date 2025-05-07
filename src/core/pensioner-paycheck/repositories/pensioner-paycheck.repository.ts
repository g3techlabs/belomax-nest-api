import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { CreatePensionerPaycheckInput } from '../inputs/create-pensioner-paycheck.input';

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
        },
      });

      return createdPaycheck;
    } catch (error) {
      console.error('❌ Erro ao criar contracheque:', error);
      throw error;
    }
  }
}
