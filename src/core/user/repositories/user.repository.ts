import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateUserInput } from '../inputs/update-user.input';
import { FindManyUserInput } from '../inputs/find-many-user.input';
import { CreateUserInput } from '../inputs/create-user.input';

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

  async update(id: string, data: UpdateUserInput): Promise<User> {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async changePassword(id: string, password: string): Promise<User> {
    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password,
      },
    });
  }

  async findMany({
    name,
    email,
    role,
    page,
    take,
  }: FindManyUserInput): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: {
        name:
          name && name.trim() !== ''
            ? { contains: name, mode: 'insensitive' }
            : undefined,
        email:
          email && email.trim() !== ''
            ? { contains: email, mode: 'insensitive' }
            : undefined,
        role: role ? { equals: role } : undefined,
      },
      take: take ?? 10,
      skip: page ? (page - 1) * (take ?? 10) : 0,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
