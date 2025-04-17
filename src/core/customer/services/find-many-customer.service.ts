import { Injectable } from '@nestjs/common';
import { FindManyCustomerInput } from '../inputs/find-many-customer.input';
import { CustomerRepository } from '../repositories/customer.repository';
import { FindManyCustomerDto } from '../dto/find-many-customer.dto';

@Injectable()
export class FindManyCustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute({ cpf, name, limit, page }: FindManyCustomerInput): Promise<FindManyCustomerDto> {
    const [customers, countCustomers] = await this.customerRepository.findMany({
      cpf,
      name,
      limit,
      page,
    });

    return {
      customers,
      totalCount: countCustomers,
    };
  }
}
