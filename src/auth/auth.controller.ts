import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log('hit');
    return this.authService.signIn(email, password, response);
  }

  @Post('/register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    console.log(request.body);
    return this.authService.register(email, password, response);
  }

  @Get('user')
  async user(@Req() request: Request) {
    return this.authService.getCurrentUser(request);
  }

  @Get('refresh')
  async refresh(@Req() request: Request) {
    return this.authService.refresh(request);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logOut(response);
  }
}
