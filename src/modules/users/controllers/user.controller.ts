import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FindUserService } from '../services/find-user.service';
import { CreateUserService } from '../services/create-user.service';
import { CreateUserInput } from '../inputs/create-user.input';
import { AuthenticateUserInput } from '../inputs/authenticate-user.input';
import { AuthenticateUserDTO } from '../dtos/authenticate-user';
import { AuthenticateUserService } from '../services/authenticate-user.service';
import { User } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';
@Controller('users')
export class UserController {
  constructor(
    private readonly findUserService: FindUserService,
    private readonly createUserService: CreateUserService,
    private readonly authenticateUserService: AuthenticateUserService,
  ) {}

  @UseGuards(AuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<User | null> {
    return await this.findUserService.execute(id);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Post()
  async create(@Body() data: CreateUserInput): Promise<User | null> {
    return await this.createUserService.execute(data);
  }

  @Post('authenticate')
  async authenticate(
    @Body() data: AuthenticateUserInput,
  ): Promise<AuthenticateUserDTO> {
    return await this.authenticateUserService.execute(data);
  }
}
