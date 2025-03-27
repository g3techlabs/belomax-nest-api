import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class SendTokenEmailService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectQueue('users-queue') private readonly tokenEmailQueue: Queue,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // criar token

    await this.tokenEmailQueue.add('send-token-by-email', {
      userId: user.id,
      email: user.email,
      // passar token
    });
  }
}
