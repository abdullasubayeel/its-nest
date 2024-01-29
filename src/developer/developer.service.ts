import { Injectable } from '@nestjs/common';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DeveloperService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: Prisma.DeveloperCreateInput) {
    const curDeveloper = await this.databaseService.developer.create({
      data,
    });
    return curDeveloper;
  }

  findAll() {
    return `This action returns all developer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} developer`;
  }

  update(id: number, updateDeveloperDto: UpdateDeveloperDto) {
    return `This action updates a #${id} developer`;
  }

  remove(id: number) {
    return `This action removes a #${id} developer`;
  }
}
