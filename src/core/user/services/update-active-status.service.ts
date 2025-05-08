import { UserRepository } from 'src/core/user/repositories/user.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateActiveStatusDTO } from '../dtos/update-active-status.dto';

@Injectable()
export class UpdateActiveStatusService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ id, active }: UpdateActiveStatusDTO) {
    const user = await this.userRepository.findById(id);

    if (!user) throw new NotFoundException('User not found');

    await this.userRepository.updateActiveStatus(id, active);
  }
}
