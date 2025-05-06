/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { CreateCustomerInput } from '../inputs/create-customer.input';
import { FindManyCustomerInput } from '../inputs/find-many-customer.input';
import { UpdateCustomerInput } from '../inputs/update-customer.input';
import { AddressRepository } from '../../address/repositories/address.repository';
import { CreateAddressInput } from '../../address/inputs/create-address.input';
import { UpdateAddressInput } from '../inputs/update-address.input';
@Injectable()
export class CustomerRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly addressRepository: AddressRepository,
  ) {}

  async findMany({ cpfCnpj, name, limit, page }: FindManyCustomerInput) {
    const customers = this.prisma.customer.findMany({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        cpfCnpj: cpfCnpj
          ? { contains: cpfCnpj, mode: 'insensitive' }
          : undefined,
      },
      take: limit,
      skip: page && limit ? (page - 1) * limit : undefined,
    });

    const countCustomers = this.prisma.customer.count({
      where: {
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        cpfCnpj: cpfCnpj
          ? { contains: cpfCnpj, mode: 'insensitive' }
          : undefined,
      },
    });

    return await this.prisma.$transaction([customers, countCustomers]);
  }

  async findById(id: string) {
    return await this.prisma.customer.findFirst({
      where: {
        id,
      },
      include: {
        address: true,
      }
    });
  }

  async findByCpfCnpj(cpfCnpj: string) {
    return await this.prisma.customer.findFirst({
      where: {
        cpfCnpj,
      },
      include: {
        address: true,
      }
    });
  }

  async findByRg(rg: string) {
    return await this.prisma.customer.findFirst({
      where: {
        rg,
      },
      include: {
        address: true,
      }
    });
  }

  async create(data: CreateCustomerInput) {
    const addressId = await this.createAddressIfNotNull(data.address);
    return await this.createCustomerWithAddress(addressId, data);
  }

  async update(id: string, data: UpdateCustomerInput) {
    await this.updateAddressIfNotNull(data.address);
    return await this.updateCustomerWithoutAddress(id, data);
  }

  private async createAddressIfNotNull(
    address: CreateAddressInput | undefined,
  ): Promise<string | undefined> {
    if (!address) return undefined;

    const { id } = await this.addressRepository.create(address);
    return id;
  }

  private async createCustomerWithAddress(
    addressId: string | undefined,
    customerInput: CreateCustomerInput,
  ) {
    const { address: _, ...dataWithoutAddress } = customerInput;
    const formattedData = {
      ...dataWithoutAddress,
      addressId,
    };
    return await this.prisma.customer.create({
      data: formattedData,
    });
  }

  private async updateAddressIfNotNull(
    address: UpdateAddressInput | undefined,
  ) {
    if (!address) return undefined;

    return await this.addressRepository.update(address.id, address);
  }

  private async updateCustomerWithoutAddress(
    id: string,
    customerInput: UpdateCustomerInput,
  ) {
    const { address: _, ...dataWithoutAddress } = customerInput;
    return await this.prisma.customer.update({
      where: {
        id,
      },
      data: dataWithoutAddress,
    });
  }
}
