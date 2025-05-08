import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateCustomerInput } from '../inputs/update-customer.input';
import { CustomerRepository } from '../repositories/customer.repository';
import { Customer } from '@prisma/client';
@Injectable()
export class UpdateCustomerService {
  private customer: Customer;
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(id: string, data: UpdateCustomerInput) {
    this.customer = await this.checkIfCustomerExists(id);

    await this.checkDuplicatedValues(data.cpfCnpj, data.rg);

    return this.customerRepository.update(id, data);
  }

  private async checkIfCustomerExists(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(id);

    if (!customer) throw new NotFoundException('O cliente não foi encontrado');
    return customer;
  }

  private async checkDuplicatedValues(
    cpfCnpj: string | undefined,
    rg: string | undefined,
  ) {
    const isCpfCnpjValid = this.checkIfCpfCnpjIsValid(cpfCnpj);

    if (isCpfCnpjValid) await this.checkIfCpfCnpjIsTaken(cpfCnpj ?? '');

    const isRgValid = this.checkIfRgIsValid(rg);

    if (isRgValid) await this.checkIfRgIsTaken(rg ?? '');
  }

  private checkIfCpfCnpjIsValid(cpfCnpj: string | undefined): boolean {
    if (cpfCnpj && cpfCnpj !== this.customer.cpfCnpj) return true;
    return false;
  }

  private async checkIfCpfCnpjIsTaken(cpfCnpj: string) {
    const customer = await this.customerRepository.findByCpfCnpj(cpfCnpj);
    if (customer)
      throw new ConflictException('Um cliente com esse CPF/CNPJ já existe');
  }

  private checkIfRgIsValid(rg: string | undefined): boolean {
    if (rg && rg !== this.customer.rg) return true;
    return false;
  }

  private async checkIfRgIsTaken(rg: string) {
    const customer = await this.customerRepository.findByRg(rg);

    if (customer)
      throw new ConflictException('Um cliente com esse RG já existe');
  }
}
