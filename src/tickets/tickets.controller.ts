// auth.controller.ts

import {
    Controller,
    Get,
    Request,
    Response,
    HttpStatus,
    HttpCode,
  } from '@nestjs/common';
  import { TicketsService } from './tickets.service';
import { TicketResponseDTO } from './dto/ticketResponseDTO.dto';

  
  @Controller('auth')
  export class AuthController {
    constructor(private ticketService: TicketsService) {}
   // @HttpCode(HttpStatus.OK)

    /*@Get('getMockData')
    async getMockData(@Request() res) {
      const tickets =  this.ticketService.getTicketMock();
      return res.status(200).json(new TicketResponseDTO(tickets); );
    }*/
  }
  