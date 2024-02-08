import { Injectable, UnauthorizedException } from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { Response, Request } from 'express';
import { generateToken } from 'src/utils/generateToken';
import mailService from 'src/utils/mailService';
import * as fs from 'node:fs';
import { jwtDecode } from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';
const path = require('node:path');
@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserDto: Prisma.UserCreateInput) {
    const saltOrRounds = 10;

    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );
    return this.databaseService.user.create({
      data: { ...createUserDto, password: hashedPassword },
    });
  }

  async findAll() {
    return this.databaseService.user.findMany();
  }

  async getUserByAccessToken(req: Request) {
    try {
      const token = req.headers.authorization;
      const decoded = jwtDecode(token);

      //@ts-ignore
      const currentUser = await this.findOne(decoded.UserInfo.email ?? '');

      if (!currentUser) {
        throw new Error('User doesnt exists');
      }
      const { password, ...result } = currentUser;
      return result;
    } catch (err: any) {
      console.log(err);
      throw new UnauthorizedException();
    }
  }

  async createDeveloper(
    developerDto: Prisma.UserCreateInput,
    res: Response,
    req: Request,
  ) {
    // #swagger.tags = ['Org Employees']
    try {
      const employee = await this.databaseService.user.findUnique({
        where: {
          email: developerDto.email,
        },
      });

      if (employee) {
        res.status(409).json({
          status: 409,
          message: 'User with given email already exists.',
        });
        return;
      }

      //Get manage details through acces token
      const curManager = await this.getUserByAccessToken(req);
      const resetPasswordToken = generateToken({
        UserInfo: {
          email: developerDto.email,
          roles: 'EMPLOYEE',
        },
      });
      // const createdEmployee = await Employee.create({
      //   ...body,
      //   resetToken: resetPasswordToken,
      //   resetTokenExpiration: new Date(Date.now() + 24 * 3600000),
      // });

      const createEmployee = await this.databaseService.user.create({
        data: {
          id: uuidv4(),
          roles: 'EMPLOYEE',
          managerId: curManager.id,
          ...developerDto,
        },
      });

      const emailSubject = 'Set Your Password';
      const emailText = `To set your password, use the following url: http://localhost:3000?token=${resetPasswordToken}`;

      const htmlPath = path.join(
        __dirname,
        '..',
        '..',
        'src',
        'data',
        'password_template.html',
      );

      const readHTMLFile = (path: string) => {
        return new Promise((resolve, reject) => {
          fs.readFile(path, { encoding: 'utf-8' }, (err, html) => {
            if (err) {
              reject(err);
            } else {
              resolve(html);
            }
          });
        });
      };

      const emailTemplate = await readHTMLFile(htmlPath);
      //@ts-ignore
      const emailHtml = emailTemplate.replace(
        '${resetPasswordToken}',
        resetPasswordToken,
      );
      await mailService(developerDto.email, emailSubject, null, emailHtml);
      return res.status(201).json({
        msg: 'Email Sent successfully',
        results: createEmployee,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message, status: 500 });
    }
  }

  async getDevelopers(managerId: string) {
    const devs = await this.databaseService.user.findMany({
      where: {
        roles: 'EMPLOYEE',
        managerId: managerId,
      },
      include: {
        assignedDev: true,
        projects: true,
      },
    });
    const devsWithCount = devs.map((dev) => ({
      ...dev,
      projectsCount: dev.projects.length,
      assignedTicketsCount: dev.assignedDev.length,
    }));

    return devsWithCount;
  }

  // async getCurrentUser(req: Request) {
  //   try {
  //     const token = req.cookies['jwt'];
  //     const data = await this.jwtService.verifyAsync(token);

  //     if (!data) {
  //       throw new UnauthorizedException();
  //     }
  //     console.log('data', data);
  //     const currentUser = await this.findOne(data?.UserInfo.email ?? '');

  //     const { password, ...result } = currentUser;
  //     return result;
  //   } catch (err: any) {
  //     console.log(err);
  //     throw new UnauthorizedException();
  //   }
  // }

  async setPassword(email: string, password: string, res: Response) {
    try {
      const pwdStatus = await this.databaseService.user.update({
        where: {
          email,
        },
        data: {
          password: password,
        },
      });

      res.status(200).json({
        message: 'Password updated successfully!',
        status: 200,
      });
    } catch (error) {
      console.log('Error:', error);
      res.status(500).json({
        message: 'Server error',
      });
    }
    return;
  }

  async findOne(email: string) {
    return this.databaseService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async update(id: string, updateUserDto: Prisma.UserUpdateInput) {
    return this.databaseService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  async remove(id: string, res: Response) {
    console.log('trigggerdd');
    const deleteUser = await this.databaseService.user.delete({
      where: {
        id,
      },
    });

    // if (!deleteUser) {
    //   res.status(400).json({
    //     message: "User with given Id doesn't exists.",
    //   });
    // }
    return res.status(200).json({
      message: `User with ID:${id} has been deleted successfully.`,
      status: 200,
    });
  }
}
