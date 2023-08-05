import {
   Body,
   Controller,
   Get,
   Patch,
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
   GetSingleLotteryDrawDto,
   UpdateLotteryResultDto,
   getUserLotteryDtos,
} from './dtos/lucky-draw.dtos';
import { RoleGuard } from 'src/guards/role.guard';
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
   @UseGuards(RoleGuard)
   async getAllLotteryDraw(@Query() query: GetAllLotteryDrawDto, @Res() res) {
      return this.luckyDrawService.getAllLotteryDraw(query, res);
   }

   @Get('/get-single-lucky-draw')
   @Roles('admin')
   @UseGuards(RoleGuard)
   async getSingleLotteryDraw(
      @Query() query: GetSingleLotteryDrawDto,
      @Res() res,
   ) {
      return this.luckyDrawService.getSingleLotteryDraw(query, res);
   }

   @Get('/get-single-lottery-users-lucky-numbers')
   @Roles('admin')
   @UseGuards(RoleGuard)
   async getSingleLotteryUsersLuckyNumbers(
      @Query() query: GetSingleLotteryDrawDto,
      @Res() res,
   ) {
      return this.luckyDrawService.getSingleLotteryUsersLuckyNumbers(
         query,
         res,
      );
   }

   @Get('/get-lottery-users-jackpot-numbers')
   @Roles('admin')
   @UseGuards(RoleGuard)
   async lotteryUsersJackpotNumbers(
      @Query() query: GetSingleLotteryDrawDto,
      @Res() res,
   ) {
      return this.luckyDrawService.lotteryUsersJackpotNumbers(query, res);
   }

   @Post('/buy-lottery-tickets')
   async buyLotteryTickets(@Body() body: BuyLotteryTicketsDto, @Res() res) {
      return this.luckyDrawService.buyLotteryTickets(body, res);
   }

   @Patch('/update-lucky-draw-result')
   @Roles('admin')
   @UseGuards(RoleGuard)
   async updateLotteryResult(@Body() body: UpdateLotteryResultDto, @Res() res) {
      return this.luckyDrawService.updateLotteryResult(body, res);
   }
}
