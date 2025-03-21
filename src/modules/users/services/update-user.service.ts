import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UpdateUserInput } from '../inputs/update-user.input';

@Injectable()
export class UpdateUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, { name, email }: UpdateUserInput) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.email !== email) {
      const userAlreadyExists = await this.userRepository.findByEmail(email);

      if (userAlreadyExists) {
        throw new BadRequestException('Email already in use');
      }
    }

    return await this.userRepository.update(id, { name, email });
  }
}
