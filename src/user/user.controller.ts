import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { Response, Request } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    // private authService: AuthService,
  ) {}

  @Post()
  async create(
    @Body() createUserDto: Prisma.UserCreateInput,
    @Res() res: Response,
  ) {
    const existingUser = await this.userService.findOne(createUserDto.email);

    if (existingUser) {
      res.status(409).json({
        message: 'User already exists with given email.',
        status: 409,
      });
    }
    return this.userService.create(createUserDto);
  }

  @Get('/?')
  getDevelopers(@Query('managerId') managerId: string) {
    return this.userService.getDevelopers(managerId);
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Post('developer')
  // createDeveloper(
  //   @Body() createUserDto: Prisma.UserCreateInput,
  //   @Res() res: Response,
  //   @Req() req: Request,
  // ) {
  //   return this.userService.createDeveloper(createUserDto, res, req);
  // }

  // @Post('set-Password')
  // async setDeveloperPassword(
  //   @Body() body: { password: string },
  //   @Res() res: Response,
  //   @Req() req: Request,
  // ) {
  //   const user = await this.authService.getUserByAccessToken(req);
  //   console.log('current user', user);
  //   console.log('req headr', req.headers);
  //   console.log('pwd ', body);
  //   return this.userService.setPassword(user.email, body.password, res);
  // }

  @Get(':id')
  findOne(@Param('id') username: string) {
    return this.userService.findOne(username);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: Response) {
    return this.userService.remove(id, res);
  }
}
