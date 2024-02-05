import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, DatabaseService],
})
export class ProjectModule {}
