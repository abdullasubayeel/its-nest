import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { DatabaseService } from 'src/database/database.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, DatabaseService, UserService],
})
export class ProjectModule {}
