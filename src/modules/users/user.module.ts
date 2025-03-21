import { UserController } from './controllers/user.controller';
import { Module } from '@nestjs/common';
import { FindUserService } from './services/find-user.service';
import { CreateUserService } from './services/create-user.service';
import { UserRepository } from './repositories/user.repository';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { AuthenticateUserService } from './services/authenticate-user.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
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
  ],
})
export class UserModule {}
