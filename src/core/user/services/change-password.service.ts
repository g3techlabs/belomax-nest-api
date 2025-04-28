import { User } from '@prisma/client';
import { ChangePasswordInput } from '../inputs/change-password.input';
import { UserRepository } from '../repositories/user.repository';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class ChangePasswordService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string, data: ChangePasswordInput): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordMatch = await compare(data.password, user.password ?? '');

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    if (passwordMatch && data.password === data.newPassword) {
      throw new UnauthorizedException(
        'New password must be different from the current password',
      );
    }

    const hashPassword = await hash(data.newPassword, 12);

    return await this.userRepository.changePassword(id, hashPassword);
  }
}
