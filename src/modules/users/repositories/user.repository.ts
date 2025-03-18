import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }
}
