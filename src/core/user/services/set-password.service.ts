import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { SetPasswordInput } from '../inputs/set-password.input';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInput } from '../inputs/create-user.input';
import { hash } from 'bcryptjs';

@Injectable()
export class SetPasswordService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute({ password, setPasswordToken }: SetPasswordInput) {
    try {
      const payload: CreateUserInput = await this.jwtService.verifyAsync(setPasswordToken);

      const user = await this.userRepository.findByEmail(payload.email);

      if (!user) throw new UnauthorizedException('User does not exist');

      const hashedPassword = await hash(password, 12);

      await this.userRepository.changePassword(user.id, hashedPassword);

    } catch {
      throw new UnauthorizedException('Invalid password token');
    }
  }
}
