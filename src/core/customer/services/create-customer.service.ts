import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCustomerInput } from '../inputs/create-customer.input';
import { CustomerRepository } from '../repositories/customer.repository';

@Injectable()
export class CreateCustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(data: CreateCustomerInput) {
    await this.checkForDuplicatedUniqueValues(data.cpfCnpj, data.rg);

    const customer = await this.customerRepository.create(data);

    return customer;
  }

  private async checkForDuplicatedUniqueValues(
    cpfCnpj: string,
    rg: string | undefined,
  ) {
    await this.checkIfCustomerExistsByCpfCnpj(cpfCnpj);
    await this.checkForDuplicateRg(rg);
  }

  private async checkIfCustomerExistsByCpfCnpj(cpfCnpj: string) {
    const customerExists = await this.customerRepository.findByCpfCnpj(cpfCnpj);

    if (customerExists)
      throw new ConflictException('Um cliente com esse CPF/CNPJ já existe');
  }

  private async checkForDuplicateRg(rg: string | undefined) {
    const isRgValid = this.checkIfRgIsValid(rg);

    if (isRgValid) {
      await this.checkIfCustomerExistsByRg(rg ?? '');
    }
  }

  private checkIfRgIsValid(rg: string | undefined): boolean {
    return rg ? true : false;
  }

  private async checkIfCustomerExistsByRg(rg: string) {
    const customerExists = await this.customerRepository.findByRg(rg);

    if (customerExists)
      throw new ConflictException('Um cliente com esse RG já existe');
  }
}
