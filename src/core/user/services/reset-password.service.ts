import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ResetPasswordInput } from '../inputs/reset-password.input';
import { UserRepository } from '../repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcryptjs';
import { ResetTokenRepository } from 'src/core/reset-token/repositories/reset-token.repository';

@Injectable()
export class ResetPasswordService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly resetTokenRepository: ResetTokenRepository,
  ) {}

  async resetPassword(userId: string, { password, tokenToReset }: ResetPasswordInput): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new NotFoundException('User not found');

    // ? Do a blacklist JWT
    try {
      await this.jwtService.verifyAsync(tokenToReset);
    } catch {
      throw new UnauthorizedException('You do not have enough credentials to perform this action',);
    }

    const hashedPass = await hash(password, 12);

    await this.userRepository.changePassword(userId, hashedPass);

    await this.resetTokenRepository.expireToken(userId);

    return { message: 'Password successfully reseted' };
  }
}
