import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma, Project } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class ProjectService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createProjectDto: Prisma.ProjectCreateInput) {
    const newProject = await this.databaseService.project.create({
      data: createProjectDto,
    });
    return newProject;
  }

  async findManagerProjects(managerId: string) {
    const projects = await this.databaseService.project.findMany({
      where: {
        managerId: managerId,
      },
      include: {
        developers: true,
        tickets: true,
      },
    });

    // Map through the projects to add the count of developers in each project
    const projectsWithDeveloperCount = projects.map((project) => ({
      ...project,
      developersCount: project.developers.length,
      ticketsCount: project.tickets.length,
    }));

    return projectsWithDeveloperCount;
  }

  async findDeveloperProjects(userId: string): Promise<Project[]> {
    const userProjects = await this.databaseService.userProjects.findMany({
      where: {
        userId: userId,
      },
      include: {
        Project: {
          include: {
            tickets: true,
            developers: true,
          },
        }, // Include the associated project
      },
    });
    console.log('userProjects', userProjects);
    // Extract the projects from userProjects
    const projects = userProjects.map((userProject) => userProject.Project);

    const projectsWithCounts = projects.map((project) => ({
      ...project,
      ticketsCount: project.tickets.length,
      developersCount: project.developers.length,
    }));

    return projectsWithCounts;
  }
  async findOne(id: string) {
    const project = await this.databaseService.project.findUnique({
      where: {
        id: id,
      },
      include: {
        tickets: {},
        developers: {
          include: {
            User: true,
          },
        },
      },
    });

    const formattedUserProjects = {
      id: project.id,
      title: project.title,
      description: project.description,
      managerId: project.managerId,
      tickets: project.tickets,
      developers: project.developers.map((developer) => ({
        id: developer.User.id,
        username: developer.User.username,
        fullName: developer.User.fullName,
        email: developer.User.email,
        roles: developer.User.roles,
        refreshToken: developer.User.refreshToken,
        managerId: developer.User.managerId,
        projectsAssigned: developer.User.projectsAssigned,
      })),
    };

    return formattedUserProjects;
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
