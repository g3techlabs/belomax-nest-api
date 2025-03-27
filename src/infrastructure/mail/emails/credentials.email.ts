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
        subject: 'Oiii Jonass',
        html: `<h1> Olá Jonas! Sua senha por acaso é \n${password}? </h1>`,
      })
      .then((res) => console.log(res))
      .catch((error) => console.error(error));
  }
}
