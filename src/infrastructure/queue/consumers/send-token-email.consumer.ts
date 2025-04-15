import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { TokenEmail } from 'src/infrastructure/mail/emails/token.email';
import { TokenInput } from 'src/infrastructure/mail/input/token.input';

@Injectable()
export class SendTokenEmailConsumer {
  constructor(private readonly tokenEmail: TokenEmail) {}

  async execute(job: Job<TokenInput>) {
    await this.tokenEmail.send({
      email: job.data.email,
      name: job.data.name,
      token: job.data.token,
    });

    return {};
  }
}
