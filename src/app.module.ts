import { CreateUserService } from './modules/users/services/create-user.service';
import { UserModule } from './modules/users/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { UserController } from './modules/users/controllers/user.controller';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
