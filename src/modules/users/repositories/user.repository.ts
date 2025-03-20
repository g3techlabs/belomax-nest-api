import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { CreateUserInput } from '../inputs/create-user.input';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }

  async create(data: CreateUserInput): Promise<User> {
    return await this.prisma.user.create({
      data,
    });
  }
}
