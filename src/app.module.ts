/* eslint-disable */
import { AwsModule } from './infrastructure/aws/aws.module';
import { MailModule } from './infrastructure/mail/mail.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { UserModule } from './core/user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { configConstants } from './auth/constants';
// import { join } from 'path';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ResetTokenModule } from './core/reset-token/reset-token.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AwsModule,
    MailModule,
    QueueModule,
    UserModule,
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        }
      }),
      inject: [ConfigService],
      // prefix: 'belomax-',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    ResetTokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
