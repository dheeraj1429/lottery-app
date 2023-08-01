import { Controller, Get, Query, Res } from '@nestjs/common';
import { ClientUtilsDto } from './dots/client-utils.dtos';
import { ClientUtilsService } from './client-utils.service';

@Controller('client')
export class ClientUtilsController {
   constructor(private readonly clientUtilsService: ClientUtilsService) {}

   @Get('/integration')
   async integrationClient(@Query() query: ClientUtilsDto, @Res() res) {
      console.log(query);

      return this.clientUtilsService.integrationClient(query, res);
   }
}
