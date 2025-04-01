import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { RegisterTokenInput } from '../dto/register-token.input';

@Injectable()
export class ResetTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async register(data: RegisterTokenInput) {
    return await this.prisma.resetToken.create({ data });
  }
}
