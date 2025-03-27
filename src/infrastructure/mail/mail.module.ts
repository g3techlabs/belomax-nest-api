import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { CredentialsEmail } from './emails/credentials.email';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        // host: process.env.MAIL_HOST,
        // port: Number(process.env.MAIL_PORT),
        // secure: true,
        // auth: {
        //   user: process.env.MAIL_USER,
        //   pass: process.env.MAIL_PASS,
        // },
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'eulah.mertz@ethereal.email',
          pass: 'mNDZcfDqT5Y8GU3pm9',
        },
      },
      defaults: {
        from: `B&M <eulah.mertz@ethereal.email>`,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [],
  providers: [CredentialsEmail],
  exports: [CredentialsEmail],
})
export class MailModule {}
