import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserInput } from '../inputs/create-user.input';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcryptjs';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    @InjectQueue('belomax-queue') private readonly usersQueue: Queue,
  ) {}

  async execute(data: CreateUserInput) {
    const { name, email, role, password } = data;

    const userAlreadyExists = await this.userRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new ConflictException('User already exists');
    }

    const hashPassword = password ? await hash(password, 12) : undefined;

    const user = await this.userRepository.create({
      name,
      email,
      role,
      password: hashPassword,
    });

    const payload = { email: user.email };

    const setPasswordToken = await this.jwtService.signAsync(payload);

    if (user) {
      await this.usersQueue.add('send-welcome-email', {
        name,
        email,
        setPasswordToken,
      });
    }

    return user;
  }
}
