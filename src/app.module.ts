import { UserModule } from './modules/users/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bullmq';
// import { UserController } from './modules/users/controllers/user.controller';

@Module({
  imports: [
    UserModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
      // prefix: 'belomax-',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
