import {
   Body,
   Controller,
   Get,
   Post,
   Query,
   Res,
   UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwt.guard';
import { LuckyDrawService } from './lucky-draw.service';
import {
   BuyLotteryTicketsDto,
   GetAllLotteryDrawDto,
   getUserLotteryDtos,
} from './dtos/lucky-draw.dtos';
import { AdminGuard } from 'src/guards/admin.guard';
import { Roles } from 'src/shared/decorator/roles.decorator';

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

   @Get('/get-all-lottery-draw')
   @Roles('admin')
   @UseGuards(AdminGuard)
   async getAllLotteryDraw(@Query() query: GetAllLotteryDrawDto, @Res() res) {
      return this.luckyDrawService.getAllLotteryDraw(query, res);
   }

   @Post('/buy-lottery-tickets')
   async buyLotteryTickets(@Body() body: BuyLotteryTicketsDto, @Res() res) {
      return this.luckyDrawService.buyLotteryTickets(body, res);
   }
}
