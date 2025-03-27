import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Request } from 'express';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface CustomRequest extends Request {
  user: AuthUser;
}

@Injectable()
export class AdminGuard implements CanActivate {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: CustomRequest = context.switchToHttp().getRequest();
    const reqUser = request.user;

    if (!reqUser) {
      // ? If this error is triggered, probably the useGuard(AuthGuard) is missing in the controller
      throw new UnauthorizedException('User is not authenticated');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: reqUser.id,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.role !== 'ADMIN') {
      throw new UnauthorizedException('User is not an admin');
    }

    return true;
  }
}
