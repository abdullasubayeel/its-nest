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
import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { ManagerService } from 'src/manager/manager.service';
import { DatabaseService } from 'src/database/database.service';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private managerService: ManagerService,
    private userService: UserService,
  ) {}

  @Post('/login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signIn(username, password, response);
  }

  @Post('/manager')
  async createManager(@Body() createDeveloperDto: Prisma.ManagerCreateInput) {
    const { fullName, username } = createDeveloperDto;
    const curUser = await this.userService.create();
    const curManager = await this.managerService.create();
    return this.managerService.create(createDeveloperDto);
  }
}
