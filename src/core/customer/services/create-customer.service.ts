import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCustomerInput } from '../inputs/create-customer.input';
import { CustomerRepository } from '../repositories/customer.repository';

@Injectable()
export class CreateCustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(data: CreateCustomerInput) {
    const customerExists = await this.customerRepository.findByCpfCnpj(
      data.cpf_cnpj,
    );

    if (customerExists) {
      throw new ConflictException('Customer already exists');
    }

    const customer = await this.customerRepository.create(data);

    return customer;
  }
}
