import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Prisma } from '@prisma/client';
import { CreateTicketDto } from './dto/create-ticket.dto';
import {
  UpdateTicketDetailsDto,
  UpdateTicketStatusDto,
} from './dto/update-ticket-status.dto';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  async create(@Body() createTicketDto: CreateTicketDto) {
    console.log('app', createTicketDto);
    const newTicket = await this.ticketService.create(createTicketDto);
    return newTicket;
  }

  @Put('updatestatus/:id')
  async updateTicketStatus(
    @Body() updateTicketStatusDto: UpdateTicketStatusDto,
    @Param('id') id: string,
  ) {
    return this.ticketService.updateTicketStatus(updateTicketStatusDto, id);
  }

  @Patch(':id')
  async updateTicketDetails(
    @Body() updateTicketStatusDto: UpdateTicketDetailsDto,
    @Param('id') id: string,
  ) {
    return this.ticketService.updateTicketDetails(updateTicketStatusDto, id);
  }

  @Get()
  findAll() {
    return this.ticketService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(id);
  }
}
