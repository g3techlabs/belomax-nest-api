import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResetTokenRepository } from 'src/core/reset-token/repositories/reset-token.repository';
import { VerifyTokenInput } from '../inputs/verify-token.input';

@Injectable()
export class VerifyTokenService {
  constructor(
    private resetTokenRepository: ResetTokenRepository,
    private readonly jwtService: JwtService,
  ) {}

  async verify({ email, token }: VerifyTokenInput) {
    const tokenData = await this.resetTokenRepository.findByEmail(email);

    // ? If User deleted, ResetToken data must be deleted in cascate
    if (!tokenData)
      throw new NotFoundException(
        'User do not exist or did not ask for a token',
      );

    if (token !== tokenData.token)
      throw new UnauthorizedException('Wrong token');

    if (Date.now() > tokenData.expiresAt.getTime())
      throw new UnauthorizedException('Expired token');

    const tokenToReset = await this.jwtService.signAsync({ token });

    return { message: 'Token successfully verified', tokenToReset };
  }
}
