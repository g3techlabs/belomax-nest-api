import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { WelcomeEmail } from '../../mail/emails/welcome.email';
import { WelcomeInput } from 'src/infrastructure/mail/input/welcome.input';

@Injectable()
export class SendWelcomeEmailConsumer {
  constructor(private readonly welcomeEmail: WelcomeEmail) {}

  async execute(job: Job<WelcomeInput>) {
    await this.welcomeEmail.send({
      name: job.data.name,
      email: job.data.email,
      setPasswordToken: job.data.setPasswordToken
    });

    return {};
  }
}
