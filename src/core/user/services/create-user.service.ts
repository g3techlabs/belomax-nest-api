import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserInput } from '../inputs/create-user.input';
import { hash } from 'bcryptjs';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectQueue('users-queue') private readonly usersQueue: Queue,
  ) {}

  async execute(data: CreateUserInput) {
    const { name, email, password, role } = data;

    const userAlreadyExists = await this.userRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new BadRequestException('User already exists');
    }

    const hashPassword = await hash(password, 12);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashPassword,
      role,
    });

    if (user) {
      await this.usersQueue.add('send-credentials-email', {
        email,
        password,
      });
    }

    return user;
  }
}
