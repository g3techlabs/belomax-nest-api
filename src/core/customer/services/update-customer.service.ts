import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCustomerInput } from '../inputs/update-customer.input';
import { CustomerRepository } from '../repositories/customer.repository';

@Injectable()
export class UpdateCustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(id: string, data: UpdateCustomerInput) {
    const customerExists = await this.customerRepository.findById(id);

    if (!customerExists) {
      throw new NotFoundException('Customer not found');
    }

    if (
      data.cpf_cnpj &&
      data.cpf_cnpj.trim() !== '' &&
      data.cpf_cnpj !== customerExists.cpf_cnpj
    ) {
      const customerByCpfCnpj = await this.customerRepository.findByCpfCnpj(
        data.cpf_cnpj,
      );

      if (customerByCpfCnpj) {
        throw new NotFoundException('Customer already exists');
      }
    }

    if (data.rg && data.rg.trim() !== '' && data.rg !== customerExists.rg) {
      const customerByRg = await this.customerRepository.findByRg(data.rg);

      if (customerByRg) {
        throw new NotFoundException('Customer already exists');
      }
    }

    return this.customerRepository.update(id, data);
  }
}
