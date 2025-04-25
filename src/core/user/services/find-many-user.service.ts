import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { FindManyUserInput } from '../inputs/find-many-user.input';
import { UserWithoutPassword } from '../entities/user-without-password';

@Injectable()
export class FindManyUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: FindManyUserInput): Promise<UserWithoutPassword[]> {
    const allUsers = await this.userRepository.findMany(data);

    const usersWithoutPassword = allUsers.map(
      ({ password: _, ...user }) => user,
    );

    return usersWithoutPassword;
  }
}
