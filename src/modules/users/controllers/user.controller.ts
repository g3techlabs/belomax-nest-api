import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FindUserService } from '../services/find-user.service';
import { CreateUserService } from '../services/create-user.service';
import { CreateUserInput } from '../inputs/create-user.input';
@Controller('users')
export class UserController {
  constructor(
    private readonly findUserService: FindUserService,
    private readonly createUserService: CreateUserService,
  ) {}

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.findUserService.execute(id);
  }

  @Post()
  async create(@Body() data: CreateUserInput) {
    return this.createUserService.execute(data);
  }
}
