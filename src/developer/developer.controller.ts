import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DeveloperService } from './developer.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { Prisma } from '@prisma/client';

@Controller('developer')
export class DeveloperController {
  constructor(private readonly developerService: DeveloperService) {}

  @Post()
  async create(@Body() createDeveloperDto: Prisma.DeveloperCreateInput) {
    return this.developerService.create(createDeveloperDto);
  }

  @Get()
  async findAll() {
    return this.developerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.developerService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDeveloperDto: UpdateDeveloperDto,
  ) {
    return this.developerService.update(+id, updateDeveloperDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.developerService.remove(+id);
  }
}
