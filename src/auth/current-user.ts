import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface CustomRequest extends Request {
  user: AuthUser;
}

export const CurrentUser = createParamDecorator(
  async (data: unknown, context: ExecutionContext): Promise<AuthUser> => {
    const req: CustomRequest = context.switchToHttp().getRequest();

    const prisma = new PrismaClient();

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },
);
