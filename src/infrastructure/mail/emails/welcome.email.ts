import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { WelcomeInput } from '../input/welcome.input';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WelcomeEmail {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async send({ name, email, setPasswordToken }: WelcomeInput) {
    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Seja bem-vindo à plataforma B&M',
        template: 'welcome',
        context: {
          userName: name,
          userEmail: email,
          setPasswordUrl: `${this.configService.get('BELOMAX_URL')}/set-password?token=${setPasswordToken}`,
          currentYear: new Date().getFullYear(),
        },
      })
      .then((res) => console.log(res))
      .catch((error) => console.error(error));
  }
}
