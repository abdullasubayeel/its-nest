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
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private databaseService: DatabaseService,
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

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post('developer')
  createDeveloper(
    @Body() createUserDto: Prisma.UserCreateInput,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.userService.createDeveloper(createUserDto, res, req);
  }

  @Post('set-Password')
  async setDeveloperPassword(
    @Body() body: { password: string },
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const user = await this.userService.getUserByAccessToken(req);
    const saltOrRounds = 10;

    const hashedPassword = await bcrypt.hash(body.password, saltOrRounds);
    return this.userService.setPassword(user.email, hashedPassword, res);
  }

  @Get(':id')
  findOne(@Param('id') username: string) {
    return this.userService.findOne(username);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: { fullName: string; projects: string[] },
  ) {
    const updateDeveloperTransaction = await this.databaseService.$transaction(
      async (prisma) => {
        // Create project
        const updatedDev = await prisma.user.update({
          where: {
            id,
          },
          data: {
            fullName: data.fullName,
          },
        });

        // Create junction records for each developer
        await Promise.all(
          data.projects.map(async (projectId) => {
            await prisma.userProjects.create({
              data: {
                userId: id,
                projectId: projectId,
              },
            });
          }),
        );

        return updatedDev;
      },
    );
    return updateDeveloperTransaction;
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: Response) {
    return this.userService.remove(id, res);
  }
}
