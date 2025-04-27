import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { CreateDocumentDataInput } from '../inputs/create-document.input';
import { UpdateDocumentInput } from '../inputs/update-document.input';
import { Document } from '@prisma/client';
import { FindManyDocumentInput } from '../inputs/find-many-document.input';

@Injectable()
export class DocumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateDocumentDataInput): Promise<Document> {
    return await this.prisma.document.create({
      data: {
        name: data.name,
        automation: {
          connect: {
            id: data.automationId,
          },
        },
      },
    });
  }

  async findMany(data: FindManyDocumentInput): Promise<Document[]> {
    const { name, page, limit } = data;

    return await this.prisma.document.findMany({
      where: {
        name: name
          ? {
              contains: name,
              mode: 'insensitive',
            }
          : undefined,
      },
      skip: page && limit ? (page - 1) * limit : undefined,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<Document | null> {
    return await this.prisma.document.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateDocumentInput): Promise<Document> {
    return await this.prisma.document.update({
      where: { id },
      data,
    });
  }
}
