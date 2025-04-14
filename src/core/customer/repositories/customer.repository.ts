import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { CreateCustomerInput } from '../inputs/create-customer.input';
import { FindManyCustomerInput } from '../inputs/find-many-customer.input';
import { UpdateCustomerInput } from '../inputs/update-customer.input';

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany({ cpf, name, limit, page }: FindManyCustomerInput) {
    const customers = this.prisma.customer.findMany({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        cpf: cpf ? { contains: cpf, mode: 'insensitive' } : undefined,
      },
      take: limit,
      skip: page && limit ? (page - 1) * limit : undefined,
    });

    const countCustomers = this.prisma.customer.count({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        cpf: cpf ? { contains: cpf, mode: 'insensitive' } : undefined,
      },
    });

    return await this.prisma.$transaction([customers, countCustomers]);
  }

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

  async findByRg(rg: string) {
    return await this.prisma.customer.findFirst({
      where: {
        rg,
      },
    });
  }

  async create(data: CreateCustomerInput) {
    return await this.prisma.customer.create({
      data,
    });
  }

  async update(id: string, data: UpdateCustomerInput) {
    return await this.prisma.customer.update({
      where: {
        id,
      },
      data,
    });
  }
}
