import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';

import { jwtDecode } from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string, res: Response) {
    try {
      const user = await this.usersService.findOne(email);
      console.log('Registered User:', user);
      if (!user) {
        res.status(400).json({
          message: "User with given Email doesn't exists",
          status: 400,
        });

        return;
      }
      const match = await bcrypt.compare(pass, user?.password);
      console.log(match);
      console.log(pass);
      console.log(user?.password);
      if (!match) {
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
      res.status(500).json({
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
          id: uuidv4(),
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

  async refresh(req: Request) {
    try {
      const token = req.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(token);

      if (!data) {
        throw new UnauthorizedException();
      }
      console.log('data', data);
      const currentUser = await this.usersService.findOne(
        data?.UserInfo.email ?? '',
      );

      const payload = {
        UserInfo: {
          email: currentUser.email,
          roles: currentUser.roles,
          userId: currentUser.id,
        },
      };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: '1h', // Set your desired expiration time for access token
      });

      const { password, ...result } = currentUser;
      return { accessToken, userId: currentUser.id, ...result };
    } catch (err: any) {
      console.log(err);
      throw new UnauthorizedException();
    }
  }

  async logOut(res: Response) {
    try {
      res.clearCookie('jwt');
      res.status(200).json({
        message: 'Logged Successfully!',
        status: 200,
      });
    } catch (err: any) {
      console.log('Error', err);
      res.status(500).json({
        message: 'Something went wrong',
        status: 500,
      });
    }
  }

  async getEmailByAccessToken(req: Request) {
    try {
      const token = req.headers.authorization;
      const decoded = jwtDecode(token);

      //@ts-ignore
      if (decoded.email) {
        //@ts-ignore
        return decoded.email;
      }
    } catch (err: any) {
      console.log(err);
      throw new UnauthorizedException();
    }
  }
}
