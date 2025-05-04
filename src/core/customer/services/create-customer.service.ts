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
    await this.checkIfCostumerExistsByCpfCnpj(cpfCnpj);
    await this.checkForDuplicateRg(rg);
  }
  
  private async checkIfCostumerExistsByCpfCnpj(cpfCnpj: string) {
    const costumerExists = await this.customerRepository.findByCpfCnpj(cpfCnpj);

    if (costumerExists) throw new ConflictException('Costumer already exists');
  }

  private async checkForDuplicateRg(rg: string | undefined) {
    const isRgValid = this.checkIfRgIsValid(rg);

    if (isRgValid) {
      await this.checkIfCostumerExistsByRg(rg ?? '');
    }
  }

  private checkIfRgIsValid(rg: string | undefined): boolean {
    return rg ? true : false;
  }

  private async checkIfCostumerExistsByRg(rg: string) {
    const costumerExists = await this.customerRepository.findByRg(rg);

    if (costumerExists) throw new ConflictException('Costumer already exists');
  }
}
