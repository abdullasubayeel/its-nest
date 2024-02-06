import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class ProjectService {
  constructor(private readonly databaseService: DatabaseService) {
    console.log('Database ', databaseService);
  }

  async create(createProjectDto: Prisma.ProjectCreateInput) {
    const newProject = await this.databaseService.project.create({
      data: createProjectDto,
    });
    return 'This action adds a new project';
  }

  async findManagerProjects(managerId: string) {
    const projects = await this.databaseService.project.findMany({
      where: {
        managerId: managerId,
      },
    });
    return projects;
  }

  async findDeveloperProjects(projectIds: string[]) {
    const projects = await this.databaseService.project.findMany({
      where: {
        id: {
          in: projectIds,
        },
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

  async remove(id: string) {
    const removeProject = await this.databaseService.project.delete({
      where: {
        id: id,
      },
    });
    return removeProject;
  }
}
