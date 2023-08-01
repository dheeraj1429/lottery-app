import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model } from 'mongoose';
import { LotteryGame } from 'src/tasks/schemas/lotteryGame.schema';
import { responseObject } from 'src/utils/helper';

@Injectable()
export class LuckyDrawService {
   constructor(
      @InjectModel(LotteryGame.name)
      private readonly lotteryGame: Model<LotteryGame>,
   ) {}

   async getTodayLottery(res: Response) {
      const defaultGameId = +process.env.DEFAULT_LOTTERY_GAME_ID;

      const findDocuments = await this.lotteryGame.countDocuments();

      const todayLotteryPoll = await this.lotteryGame.aggregate([
         { $match: { gameId: findDocuments + defaultGameId - 1 } },
         { $project: { createdAt: 1, lotteryPollResultTime: 1, gameId: 1 } },
      ]);

      const data = todayLotteryPoll?.[0];

      if (!data) {
         const error = responseObject(false, true, {
            message: 'Lottery Game not found',
         });
         return res.status(HttpStatus.NOT_FOUND).json(error);
      }

      const responseData = responseObject(true, false, { item: data });
      return res.status(HttpStatus.OK).json(responseData);
   }
}
