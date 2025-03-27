import { UserController } from './controllers/user.controller';
import { Module } from '@nestjs/common';
import { FindUserService } from './services/find-user.service';
import { CreateUserService } from './services/create-user.service';
import { UserRepository } from './repositories/user.repository';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticateUserService } from './services/authenticate-user.service';
import { UpdateUserService } from './services/update-user.service';
import { ChangePasswordService } from './services/change-password.service';
import { FindManyUserService } from './services/find-many-user.service';
import { BullModule } from '@nestjs/bullmq';
import { SendTokenEmailService } from './services/send-token-email.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      // secret: configConstants.JWT_SECRET,
      secret: '8d3894ef06f85e3fef81cb4b44b84287',
      signOptions: { expiresIn: '7d' },
    }),
    BullModule.registerQueue({
      name: 'users-queue',
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
  ],
})
export class UserModule {}
