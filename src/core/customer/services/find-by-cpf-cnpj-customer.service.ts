import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from '../repositories/customer.repository';

@Injectable()
export class FindByCpfCnpjCustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(cpfCnpj: string) {
    const customer = await this.customerRepository.findByCpfCnpj(cpfCnpj);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }
}
