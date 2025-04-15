import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from '../repositories/customer.repository';

@Injectable()
export class FindByCpfCustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(cpf: string) {
    const customer = await this.customerRepository.findByCpf(cpf);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }
}
