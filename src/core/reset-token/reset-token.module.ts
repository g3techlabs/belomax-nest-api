import { Module } from '@nestjs/common';
import { ResetTokenRepository } from './repositories/reset-token.repository';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';

@Module({
    providers: [ResetTokenRepository, PrismaService]
})
export class ResetTokenModule {}
