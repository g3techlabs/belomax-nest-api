import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { FindManyUserInput } from '../inputs/find-many-user.input';
import { User } from '@prisma/client';

@Injectable()
export class FindManyUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: FindManyUserInput): Promise<User[]> {
    const allUsers = await this.userRepository.findMany(data);

    return allUsers;
  }
}
