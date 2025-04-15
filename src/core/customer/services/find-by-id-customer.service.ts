import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerRepository } from '../repositories/customer.repository';

@Injectable()
export class FindByIdCustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(id: string) {
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }
}
