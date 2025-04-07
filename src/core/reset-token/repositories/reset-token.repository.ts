import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { RegisterTokenInput } from '../dto/register-token.input';

@Injectable()
export class ResetTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async register(data: RegisterTokenInput) {
    return await this.prisma.resetToken.create({ data });
  }

  async findByUserId(userId: string) {
    return await this.prisma.resetToken.findUnique({
      where: { userId },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.resetToken.findFirst({
      where: { user: { email } },
    })
  }

  async updateToken(userId: string, token: string) {
    return await this.prisma.resetToken.update({
      where: { userId },
      data: { token, expiresAt: new Date(Date.now() + 15 * 60 * 1000) },
    });
  }

  async expireToken(userId: string) {
    return await this.prisma.resetToken.update({
      where: { userId },
      data: { expiresAt: new Date(0) },
    });
  }
}
