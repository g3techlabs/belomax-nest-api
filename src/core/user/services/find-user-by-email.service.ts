import { UserRepository } from 'src/core/user/repositories/user.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserWithoutPassword } from '../entities/user-without-password';

@Injectable()
export class FindUserByEmailService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<UserWithoutPassword> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new NotFoundException('User not found')

    const {password: _, ...userWithoutPassword} = user

    return userWithoutPassword
  }
}
