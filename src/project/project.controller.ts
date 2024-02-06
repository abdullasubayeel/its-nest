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
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    // private authService: AuthService,
  ) {}

  // @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createProjectDto: Prisma.ProjectCreateInput) {
    return this.projectService.create(createProjectDto);
  }

  // @Get()
  // async findProjects(@Req() req: Request) {
  //   const userData = await this.authService.getCurrentUser(req);

  //   if (userData.roles === 'MANAGER') {
  //     return this.projectService.findManagerProjects(userData.id);
  //   } else {
  //     return this.projectService.findDeveloperProjects(
  //       userData.projectsAssigned,
  //     );
  //   }
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
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
