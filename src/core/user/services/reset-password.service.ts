import { ResetTokenRepository } from './../../reset-token/repositories/reset-token.repository';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { UserRepository } from '../repositories/user.repository';
import * as mod from "node:crypto"

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectQueue('users-queue') private usersQueue: Queue,
    private userRepository: UserRepository,
    private resetTokenRepository: ResetTokenRepository,
  ) {}

  async sendEmailToken(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) return;

    const token = mod.randomInt(100000, 999999).toString()

    const tokenRegistered = await this.resetTokenRepository.register({ userId: user.id, token }) 

    await this.usersQueue.add('send-token-email', {
      token: tokenRegistered.token, email: user.email, name: user.name
    });
  }
}
