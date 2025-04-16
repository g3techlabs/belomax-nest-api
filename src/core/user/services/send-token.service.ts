import { ResetTokenRepository } from '../../reset-token/repositories/reset-token.repository';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { UserRepository } from '../repositories/user.repository';
import * as mod from 'node:crypto';

@Injectable()
export class SendEmailTokenService {
  constructor(
    @InjectQueue('belomax-queue') private usersQueue: Queue,
    private userRepository: UserRepository,
    private resetTokenRepository: ResetTokenRepository,
  ) {}

  async send(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) return;

    const hasToken = await this.resetTokenRepository.findByUserId(user.id);

    if (hasToken) {
      if (hasToken.expiresAt.getTime() > Date.now()) {
        await this.usersQueue.add('send-token-email', {
          token: hasToken.token,
          email: user.email,
          name: user.name,
        });
      } else {
        const token = mod.randomInt(100000, 999999).toString();

        const newToken = await this.resetTokenRepository.updateToken(
          user.id,
          token,
        );

        await this.usersQueue.add('send-token-email', {
          token: newToken.token,
          email: user.email,
          name: user.name,
        });
      }
      return;
    }

    const token = mod.randomInt(100000, 999999).toString();

    const tokenRegistered = await this.resetTokenRepository.register({
      userId: user.id,
      token,
    });

    await this.usersQueue.add('send-token-email', {
      token: tokenRegistered.token,
      email: user.email,
      name: user.name,
    });
  }
}
