import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { AuthenticateUserDTO } from '../dtos/authenticate-user';
import { compare } from 'bcryptjs';
import { AuthenticateUserInput } from '../inputs/authenticate-user.input';

@Injectable()
export class AuthenticateUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserInput): Promise<AuthenticateUserDTO> {
    const findUserByEmail = await this.userRepository.findByEmail(email);

    if (!findUserByEmail) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordIsValid = await compare(password, findUserByEmail.password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwtService.signAsync({ id: findUserByEmail.id });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = findUserByEmail;

    return {
      data: userWithoutPassword,
      access_token: token,
    };
  }
}
