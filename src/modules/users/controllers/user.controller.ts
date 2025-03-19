import { Controller, Get, Param } from '@nestjs/common';
import { FindUserService } from '../services/find-user.service';
@Controller('users')
export class UserController {
  constructor(private readonly findUserService: FindUserService) {}

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.findUserService.execute(id);
  }
}
