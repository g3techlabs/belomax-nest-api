import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { TokenInput } from '../input/token.input';

@Injectable()
export class TokenEmail {
  constructor(private readonly mailerService: MailerService) {}

  async send({ email, name, token }: TokenInput) {
    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Seu token para mudar de senha - B&M',
        template: 'token',
        context: {
          userName: name,
          token: token,
          expiryTime: 15,
          userEmail: email,
          resetPasswordUrl: 'https://www.google.com',
          currentYear: new Date().getFullYear(),
          logoUrl: 'public/images/email-logo.png',
        },
      })
      .then((res) => console.log(res))
      .catch((error) => console.error(error));
  }
}
