import { Injectable } from '@nestjs/common';
import { FindManyCustomerInput } from '../inputs/find-many-customer.input';
import { CustomerRepository } from '../repositories/customer.repository';

@Injectable()
export class FindManyCustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute({ cpf, name, limit, page }: FindManyCustomerInput) {
    const [customers, countCustomers] = await this.customerRepository.findMany({
      cpf,
      name,
      limit,
      page,
    });

    return {
      customers,
      total: countCustomers,
    };
  }
}
