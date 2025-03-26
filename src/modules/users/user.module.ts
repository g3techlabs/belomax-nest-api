import { UserController } from './controllers/user.controller';
import { Module } from '@nestjs/common';
import { FindUserService } from './services/find-user.service';
import { CreateUserService } from './services/create-user.service';
import { UserRepository } from './repositories/user.repository';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { AuthenticateUserService } from './services/authenticate-user.service';
import { UpdateUserService } from './services/update-user.service';
import { ChangePasswordService } from './services/change-password.service';
import { FindManyUserService } from './services/find-many-user.service';
import { BullModule } from '@nestjs/bullmq';
import { SendTokenEmailService } from './services/send-token-email.service';
import { TokenEmailConsumer } from './jobs/consumers/send-token-email.consumer';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
    BullModule.registerQueue({
      name: 'token-email',
    }),
  ],
  controllers: [UserController],
  providers: [
    //Repositories
    UserRepository,

    //Services
    FindUserService,
    CreateUserService,
    AuthenticateUserService,
    UpdateUserService,
    ChangePasswordService,
    FindManyUserService,
    SendTokenEmailService,

    //Consumers
    TokenEmailConsumer,
  ],
})
export class UserModule {}
