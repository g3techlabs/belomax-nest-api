import { Injectable, NotFoundException } from '@nestjs/common';
import { PensionerPaycheckRepository } from '../repositories/pensioner-paycheck.repository';

@Injectable()
export class FindByIdPensionerPaycheckService {
  constructor(
    private readonly pensionerPaycheckRepository: PensionerPaycheckRepository,
  ) {}

  async execute(id: string) {
    const pensionerPaycheck =
      await this.pensionerPaycheckRepository.findById(id);

    if (!pensionerPaycheck) {
      throw new NotFoundException('Contracheque de Pensionista não encontrado');
    }

    return pensionerPaycheck;
  }
}
