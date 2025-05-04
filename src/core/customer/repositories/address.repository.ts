import { Injectable } from '@nestjs/common';
import { Address, PrismaClient } from '@prisma/client';
import { CreateAddressInput } from '../inputs/create-address.input';
import { UpdateAddressInput } from '../inputs/update-address.input';

@Injectable()
export class AddressRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateAddressInput): Promise<Address> {
    return await this.prisma.address.create({ data });
  }

  async findById(id: string): Promise<Address | null> {
    return await this.prisma.address.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateAddressInput) {
    return await this.prisma.address.update({ where: { id }, data });
  }
}
