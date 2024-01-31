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

  async signIn(email: string, pass: string, res: Response) {
    try {
      const user = await this.usersService.findOne(email);
      if (!user) {
        res.status(400).json({
          message: "User with given Email doesn't exists",
          status: 400,
        });
      } else if (user?.password != pass) {
        res.status(400).json({
          message: 'Invalid Credentials',
          status: 400,
        });
      } else {
        const payload = {
          UserInfo: {
            email: user.email,
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
        res.status(200).json({
          access_token: accessToken,
          status: 200,
          message: 'Login Successful!',
        });
      }
    } catch (err: any) {
      console.log('Error:', err);
      res.json({
        message: 'Something went wrong',
        status: 500,
      });
    }
  }

  async register(email: string, pass: string, res: Response) {
    try {
      const existingUser = await this.usersService.findOne(email);

      if (existingUser) {
        res.status(409).json({
          message: 'User already exists with given Email.',
          status: 409,
        });
      } else {
        await this.usersService.create({
          email,
          password: pass,
          roles: 'MANAGER',
          username: '',
        });

        res.status(201).json({
          message: 'User Created Sucessfully!',
          status: 201,
        });
      }
    } catch (err: any) {
      console.log('Error:', err);
      res.status(500).json({
        message: 'Something went wrong',
        status: 500,
      });
    }
  }
}
