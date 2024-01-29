import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string, res: Response) {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new NotFoundException();
    }
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = {
      UserInfo: {
        username: user.username,
        roles: user.roles,
        userId: user.id,
      },
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h', // Set your desired expiration time for access token
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d', // Set your desired expiration time for refresh token
    });

    res.cookie('jwt', refreshToken);
    return {
      access_token: accessToken,
    };
  }
}
