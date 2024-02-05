import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class ProjectService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createProjectDto: Prisma.ProjectCreateInput) {
    const newProject = this.databaseService.project.create({
      data: createProjectDto,
    });
    return 'This action adds a new project';
  }

  findAll(managerId: number) {
    const projects = this.databaseService.project.findMany({
      where: {
        managerId: managerId,
      },
    });
    return projects;
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
