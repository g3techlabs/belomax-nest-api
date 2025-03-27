import { MailModule } from './infrastructure/mail/mail.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { UserModule } from './core/user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { configConstants } from './auth/constants';
// import { join } from 'path';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailModule,
    QueueModule,
    UserModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
      // prefix: 'belomax-',
    }),
    // MailerModule.forRoot({
    //   options: {
    //     host: configConstants.email.MAIL_HOST,
    //     port: Number(configConstants.email.MAIL_PORT),
    //     secure: true,
    //     auth: {
    //       user: configConstants.email.MAIL_USER,
    //       pass: configConstants.email.MAIL_PASS,
    //     },
    //   },
    //   defaults: {
    //     from: `Os meus ovos <${configConstants.email.MAIL_USER}>`,
    //   },
    //   template: {
    //     dir: join(__dirname, 'templates'),
    //     adapter: new HandlebarsAdapter(),
    //     options: {
    //       strict: true,
    //     },
    //   },
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
