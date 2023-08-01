import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
   LotteryGame,
   LotteryGameSchemaDocument,
} from './schemas/lotteryGame.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { generateUniqueRandomNumbers } from 'src/utils/helper';
import {
   LotteryUsers,
   LotteryUsersDocument,
} from './schemas/lotteryUsers.schema';
import { NumberCombination } from './schemas/number-combinations.schema';

@Injectable()
export class TasksService {
   constructor(
      @InjectModel(LotteryGame.name)
      private readonly lotteryGameModel: Model<LotteryGame>,
      @InjectModel(LotteryUsers.name)
      private readonly lotteryGameUsersModel: Model<LotteryUsers>,
      @InjectModel(NumberCombination.name)
      private readonly numberCombination: Model<NumberCombination>,
   ) {}
   private readonly logger = new Logger(TasksService.name);

   getTomorrowDate() {
      var currentTime = new Date();
      var updatedTime = new Date(currentTime.getTime() + 60000 * 3);
      return updatedTime;
   }

   genrateCombinations() {
      const combinations = new Array(4).fill({}).map(() => {
         const uniqueAr = generateUniqueRandomNumbers(5, 1, 36);

         return {
            luckyNumbers: uniqueAr,
            jackpotBallNumber: Math.floor(Math.random() * 10 + 1),
         };
      });

      return combinations;
   }

   async genrateNewGame(
      gameId: number,
      _id: mongoose.Types.ObjectId,
      nextRoundDate: Date,
   ) {
      const combinations = this.genrateCombinations();

      // create new game.
      const createLotteryGame = await new this.lotteryGameModel({
         _id,
         gameId,
         lotteryResultTime: nextRoundDate,
         lotteryResult: {
            luckyNumbers: [],
         },
         lotteryResultShow: false,
      }).save();

      console.log('createLotteryGame =>', createLotteryGame);

      // store the game numbers combination.
      const createNumberCombination = await new this.numberCombination({
         gameId,
         lotteryGameId: _id,
         combinations,
      }).save();

      console.log('createNumberCombination =>', createNumberCombination);

      // create the game user lobby.
      const createLotteryGameLobby = await new this.lotteryGameUsersModel({
         gameId,
         lotteryGameId: _id,
         lotteryParticipateUsers: [],
         winners: [],
      }).save();

      console.log('createLotteryGameLobby =>', createLotteryGameLobby);
   }

   async updateLotteryPollResult(
      lottery: LotteryGameSchemaDocument,
      lotteryUsers: LotteryUsersDocument,
   ) {
      if (!lotteryUsers && !lottery) {
         return {
            refundTicketsArray: [],
            winnersTicketsArray: [],
         };
      }
   }

   @Cron('*/10 * * * * *')
   async handleCron() {
      this.logger.debug('Called when the current second');

      const findDocuments = await this.lotteryGameModel.countDocuments();
      const defaultGameId = +process.env.DEFAULT_LOTTERY_GAME_ID;
      // get the tomorrow date.
      const nextRoundDate = this.getTomorrowDate();

      console.log(defaultGameId);

      // find the previous game information
      const lottery = await this.lotteryGameModel.findOne({
         gameId: findDocuments + defaultGameId - 1,
      });

      const lotteryUsers = await this.lotteryGameUsersModel.findOne({
         gameId: findDocuments + defaultGameId - 1,
      });

      // const { refundTicketsArray, winnersTicketsArray } =
      //    await this.updateLotteryPollResult(lottery, lotteryUsers);

      // genrate the next game id and _id.
      const gameId = findDocuments + defaultGameId;
      const _id = new mongoose.Types.ObjectId();

      // const game = await this.genrateNewGame(gameId, _id, nextRoundDate);
   }
}
