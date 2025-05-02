import { UserRepository } from 'src/core/user/repositories/user.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateActiveStatusServiceInput } from '../inputs/update-active-status.input';

@Injectable()
export class UpdateActiveStatusService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ id, active }: UpdateActiveStatusServiceInput) {
    const user = await this.userRepository.findById(id);

    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.updateActiveStatus(id, active);
  }
}
