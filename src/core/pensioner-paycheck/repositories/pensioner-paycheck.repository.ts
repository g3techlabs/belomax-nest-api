import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';

@Injectable()
export class PensionerPaycheckRepository {
  constructor(private readonly prisma: PrismaService) {}
}
