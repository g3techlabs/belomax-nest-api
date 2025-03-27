import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { CredentialsInput } from '../input/credentials.input';

@Injectable()
export class CredentialsEmail {
  constructor(private readonly mailerService: MailerService) {}

  async send({ email, password }: CredentialsInput) {
    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Credenciais de Acesso - B&M',
        template: 'credentials',
        context: {
          userName: 'Bruce',
          userEmail: email,
          temporaryPassword: password,
          resetPasswordUrl: 'https://www.google.com',
          currentYear: new Date().getFullYear(),
        },
      })
      .then((res) => console.log(res))
      .catch((error) => console.error(error));
  }
}
