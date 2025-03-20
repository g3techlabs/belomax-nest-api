import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserInput } from '../inputs/create-user.input';
import { hash } from 'bcryptjs';

@Injectable()
export class CreateUserService {
  constructor(private readonly userRepository: UserRepository) {}

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

    return user;
  }
}
