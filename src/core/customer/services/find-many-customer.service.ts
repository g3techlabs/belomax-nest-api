import { Injectable } from '@nestjs/common';
import { FindManyCustomerInput } from '../inputs/find-many-customer.input';
import { CustomerRepository } from '../repositories/customer.repository';
import { FindManyCustomerDto } from '../dto/find-many-customer.dto';

@Injectable()
export class FindManyCustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(data: FindManyCustomerInput): Promise<FindManyCustomerDto> {
    const [customers, countCustomers] =
      await this.customerRepository.findMany(data);

    return {
      customers,
      totalCount: countCustomers,
    };
  }
}
