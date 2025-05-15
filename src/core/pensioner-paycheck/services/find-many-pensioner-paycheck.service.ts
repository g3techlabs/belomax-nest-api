import { Injectable } from '@nestjs/common';
import { PensionerPaycheckRepository } from '../repositories/pensioner-paycheck.repository';
import { FindManyPensionerPaycheckInput } from '../inputs/find-many-pensioner-paycheck.input';

@Injectable()
export class FindManyPensionerPaycheckService {
  constructor(
    private readonly pensionerPaycheckRepository: PensionerPaycheckRepository,
  ) {}

  async execute(data: FindManyPensionerPaycheckInput) {
    return await this.pensionerPaycheckRepository.findMany(data);
  }
}
