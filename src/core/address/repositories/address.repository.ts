/* eslint-disable */

import { Injectable } from '@nestjs/common';
import { CreateAddressInput } from '../inputs/create-address.input';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { UpdateAddressInput } from '../inputs/update-address.input';

@Injectable()
export class AddressRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAddressInput) {
    return await this.prisma.address.create({ data });
  }

  async findById(id: string) {
    return await this.prisma.address.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateAddressInput) {
    return await this.prisma.address.update({ where: { id }, data });
  }
}
