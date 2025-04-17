import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from 'src/core/user/repositories/user.repository';
import { CustomRequest } from '../current-user';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UserRepository))
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: CustomRequest = context.switchToHttp().getRequest();
    const reqUser = request.user;

    if (!reqUser) {
      // ? If this error is triggered, probably the useGuard(AuthGuard) is missing in the controller
      throw new UnauthorizedException('User is not authenticated');
    }

    const user = await this.userRepository.findById(reqUser.id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.role !== 'ADMIN') {
      throw new UnauthorizedException('User is not an admin');
    }

    return true;
  }
}
