import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/guards/jwt-guard.guard';
import { LuckyDrawService } from './lucky-draw.service';

@UseGuards(JwtGuard)
@Controller('lucky-draw')
export class LuckyDrawController {
   constructor(private readonly luckyDrawService: LuckyDrawService) {}

   @Get('/get-today-lottery')
   async getTodayLottery(@Res() res) {
      return this.luckyDrawService.getTodayLottery(res);
   }
}
