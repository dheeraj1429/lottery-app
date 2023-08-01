import {
   Body,
   Controller,
   Get,
   Post,
   Query,
   Res,
   UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwt-guard.guard';
import { LuckyDrawService } from './lucky-draw.service';
import {
   BuyLotteryTicketsDto,
   getUserLotteryDtos,
} from './dtos/lucky-draw.dtos';

@UseGuards(JwtGuard)
@Controller('lucky-draw')
export class LuckyDrawController {
   constructor(private readonly luckyDrawService: LuckyDrawService) {}

   @Get('/get-today-lottery')
   async getTodayLottery(@Res() res) {
      return this.luckyDrawService.getTodayLottery(res);
   }

   @Get('/get-user-lottery-tickets')
   async getUserLotteryTickets(@Query() query: getUserLotteryDtos, @Res() res) {
      return this.luckyDrawService.getUserLotteryTickets(query, res);
   }

   @Post('/buy-lottery-tickets')
   async buyLotteryTickets(@Body() body: BuyLotteryTicketsDto, @Res() res) {
      return this.luckyDrawService.buyLotteryTickets(body, res);
   }
}
