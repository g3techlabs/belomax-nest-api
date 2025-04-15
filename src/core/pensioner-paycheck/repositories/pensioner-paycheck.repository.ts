import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { CreatePensionerPaycheckInput } from '../inputs/create-pensioner-paycheck.input';

@Injectable()
export class PensionerPaycheckRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePensionerPaycheckInput) {
    // const {
    // registration,
    // bond,
    // cpf,
    // pensionerNumber,
    // month,
    // year,
    // consignableMargin,
    // totalBenefits,
    // netToReceive,
    // userId,
    // customerName,
    // terms,
    // }: CreatePensionerPaycheckInput = data;

    try {
      const createAutomation = await this.prisma.automation.create({
        data: {
          description: 'Contracheque de Pensionistas',
        },
      });

      return createAutomation;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error creating automation:', error.message);
      }
      throw error;
    }
  }
}
