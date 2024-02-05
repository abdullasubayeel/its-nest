import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';

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

  async getDevelopers(managerId: number) {
    return this.databaseService.user.findMany({
      where: {
        roles: 'EMPLOYEE',
        managerId: managerId,
      },
    });
  }

  async findOne(email: string) {
    return this.databaseService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.databaseService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return this.databaseService.user.delete({
      where: {
        id,
      },
    });
  }
}
