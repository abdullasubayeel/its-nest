import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import {
  UpdateTicketDetailsDto,
  UpdateTicketStatusDto,
} from './dto/update-ticket-status.dto';
@Injectable()
export class TicketService {
  constructor(private databaseService: DatabaseService) {}

  async create(createTicketDto: CreateTicketDto) {
    const newTicket = await this.databaseService.ticket.create({
      data: {
        id: uuidv4(),
        title: createTicketDto.title,
        issueType: createTicketDto.issueType,
        description: createTicketDto.description,
        priority: createTicketDto.priority,
        assigneeDeveloper: {
          connect: { id: createTicketDto.assignee },
        },
        status: createTicketDto.status,
        reportingDeveloper: {
          connect: {
            id: createTicketDto.reporter,
          },
        },
        project: {
          connect: {
            id: createTicketDto.projectId,
          },
        },
      },
    });
    return newTicket;
  }

  async updateTicketStatus(
    updateTicketStatusDto: UpdateTicketStatusDto,
    id: string,
  ) {
    const updatedStatus = await this.databaseService.ticket.update({
      where: {
        id: id,
      },
      data: {
        status: updateTicketStatusDto.status,
      },
    });
    return updatedStatus;
  }

  findAll() {
    return `This action returns all ticket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  async updateTicketDetails(
    updateTicketDto: UpdateTicketDetailsDto,
    id: string,
  ) {
    console.log('details', updateTicketDto);

    const updatedTicket = await this.databaseService.ticket.update({
      where: {
        id: id,
      },
      data: {
        title: updateTicketDto.title,
        issueType: updateTicketDto.issueType,
        description: updateTicketDto.description,
        priority: updateTicketDto.priority,
        assigneeDeveloper: {
          connect: { id: updateTicketDto.assignee },
        },
        status: updateTicketDto.status,
        reportingDeveloper: {
          connect: {
            id: updateTicketDto.reporter,
          },
        },
      },
    });
    return updatedTicket;
  }

  async remove(id: string) {
    const removedTicket = await this.databaseService.ticket.delete({
      where: {
        id: id,
      },
    });
    return removedTicket;
  }
}
