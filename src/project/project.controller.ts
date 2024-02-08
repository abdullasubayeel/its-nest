import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
  Put,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';

import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from 'src/database/database.service';
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly databaseService: DatabaseService,
  ) {}

  // @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() data: { description: string; employees: string[]; title: string },
    @Req() req: Request,
  ) {
    const currentManager = await this.userService.getUserByAccessToken(req);

    if (!currentManager) {
      throw new UnauthorizedException();
    }

    const projectId = uuidv4(); // Generate project ID

    const createdProject = await this.databaseService.$transaction(
      async (prisma) => {
        // Create project
        const newProject = await prisma.project.create({
          data: {
            id: projectId,
            title: data.title,
            description: data.description,
            manager: {
              connect: {
                id: currentManager.id,
              },
            },
          },
        });

        // Create junction records for each developer
        await Promise.all(
          data.employees.map(async (employeeId) => {
            await prisma.userProjects.create({
              data: {
                userId: employeeId,
                projectId: newProject.id,
              },
            });
          }),
        );

        return newProject;
      },
    );

    return createdProject;

    // return this.projectService.create({
    //   id: uuidv4(),
    //   title: data.title,
    //   description: data.description,
    //   developers: developersData,
    //   manager: {
    //     connect: {
    //       id: currentManager.id,
    //     },
    //   },
    // });
  }

  @Get()
  async findProjects(@Req() req: Request) {
    const userData = await this.userService.getUserByAccessToken(req);
    console.log('userData.roles ', userData.roles);
    if (userData.roles === 'MANAGER') {
      return this.projectService.findManagerProjects(userData.id);
    } else {
      console.log('passsigned', userData.projectsAssigned);
      return this.projectService.findDeveloperProjects(userData.id);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}
