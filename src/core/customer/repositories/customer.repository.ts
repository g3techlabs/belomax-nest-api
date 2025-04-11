import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { CreateCustomerInput } from '../inputs/create-customer.input';

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return await this.prisma.customer.findFirst({
      where: {
        id,
      },
    });
  }

  async findByCpf(cpf: string) {
    return await this.prisma.customer.findFirst({
      where: {
        cpf,
      },
    });
  }

  async create(data: CreateCustomerInput) {
    return await this.prisma.customer.create({
      data,
    });
  }
}
