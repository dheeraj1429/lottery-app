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
import { TicketsArrayInterface } from '.';
import { AccountConfig } from 'src/account-config/schemas/account-config.schema';
import axios from 'axios';

@Injectable()
export class TasksService {
   constructor(
      @InjectModel(LotteryGame.name)
      private readonly lotteryGameModel: Model<LotteryGame>,
      @InjectModel(LotteryUsers.name)
      private readonly lotteryGameUsersModel: Model<LotteryUsers>,
      @InjectModel(NumberCombination.name)
      private readonly numberCombination: Model<NumberCombination>,
      @InjectModel(AccountConfig.name)
      private readonly accountConfig: Model<AccountConfig>,
   ) {}
   private readonly logger = new Logger(TasksService.name);

   getTomorrowDate() {
      var currentTime = new Date();
      var updatedTime = new Date(currentTime.getTime() + 60000 * 3);
      return updatedTime;
   }

   async updateUserInformation(
      price: string,
      userId: string,
      updateApiUrl: string,
   ): Promise<{ response: { success: boolean; error: boolean } }> {
      const response = await axios.post(updateApiUrl, {
         amountInUsd: price,
         userId: userId,
      });

      if (!!response && response?.data && response?.data?.success) {
         return { response: response.data };
      }

      if (!updateApiUrl) {
         return { response: { success: false, error: true } };
      }

      return { response: { success: true, error: false } };
   }

   async updateLotteryResult(
      lottery: LotteryGameSchemaDocument,
      lotteryUsers: LotteryUsersDocument,
   ) {
      // if the user lottery & the user is not exists the return values.
      if (!lotteryUsers && !lottery) {
         return {
            refundTicketsArray: [],
            winnersTicketsArray: [],
         };
      }

      const { lotteryParticipateUsers } = lotteryUsers;
      const { lotteryResult } = lottery;

      // keep track user tickets values.
      const refundTicketsArray: TicketsArrayInterface[] = [];
      const winnersTicketsArray: TicketsArrayInterface[] = [];

      const hasParticipants =
         !!lotteryParticipateUsers && !!lotteryParticipateUsers?.length;
      const hasLotterResult = !!lotteryResult;

      if (hasParticipants && hasLotterResult) {
         // loop over the participants users and their tickets
         for (let i = 0; i < lotteryParticipateUsers?.length; i++) {
            console.log(lotteryParticipateUsers[i]?.lotteryNumbers);
            const { clientId } = lotteryParticipateUsers[i];

            // find the account config document which contains the user update information api url.
            const accountConfig = await this.accountConfig.findOne(
               { clientId },
               { updateClientInformationApi: 1 },
            );

            if (!accountConfig || !accountConfig?.updateClientInformationApi) {
               continue;
            }

            const { luckyNumbers, jackpotBallNumber } =
               lotteryParticipateUsers[i]?.lotteryNumbers;

            // get the values from the participants users tickets.
            const { numberOfTickets, userId } = lotteryParticipateUsers[i];

            // hold the matching tickets numbers and the tickets
            const matchNumbers: number[] = [];

            console.log('--------- break -------');
            // check if the lucky number of tickets matches or not.
            for (let j = 0; j < luckyNumbers.length; j++) {
               if (lotteryResult?.luckyNumbers.includes(luckyNumbers[j])) {
                  matchNumbers.push(luckyNumbers[j]);
               }
            }

            console.log('matchNumbers =>', matchNumbers);

            if (
               !matchNumbers.length &&
               jackpotBallNumber !== lotteryResult?.jackpotBallNumber
            ) {
               refundTicketsArray.push(
                  Object.assign(lotteryParticipateUsers[i], {
                     numberOfTickets: 1,
                     refundTicket: true,
                  }),
               );
            }

            if (matchNumbers.length === 3) {
               const price = (numberOfTickets * 1).toFixed(2);

               const { response } = await this.updateUserInformation(
                  price,
                  userId,
                  accountConfig?.updateClientInformationApi,
               );

               if (response?.error) {
                  continue;
               }

               winnersTicketsArray.push(
                  Object.assign(lotteryParticipateUsers[i], {
                     price,
                     matches: matchNumbers,
                     isUsed: true,
                  }),
               );
            }

            if (matchNumbers.length === 4) {
               const price = (numberOfTickets * 20).toFixed(2);

               const { response } = await this.updateUserInformation(
                  price,
                  userId,
                  accountConfig?.updateClientInformationApi,
               );

               if (response?.error) {
                  continue;
               }

               winnersTicketsArray.push(
                  Object.assign(lotteryParticipateUsers[i], {
                     price,
                     isUsed: true,
                     matches: matchNumbers,
                  }),
               );
            }

            if (
               matchNumbers.length === 5 &&
               jackpotBallNumber === lotteryResult?.jackpotBallNumber
            ) {
               const price = (numberOfTickets * 100000).toFixed(2);

               const { response } = await this.updateUserInformation(
                  price,
                  userId,
                  accountConfig?.updateClientInformationApi,
               );

               if (response?.error) {
                  continue;
               }

               winnersTicketsArray.push(
                  Object.assign(lotteryParticipateUsers[i], {
                     price,
                     isUsed: true,
                     matches: matchNumbers,
                     jackpotBallNumberMatch: lotteryResult?.jackpotBallNumber,
                  }),
               );
            }
         }
      }

      return {
         refundTicketsArray: [],
         winnersTicketsArray: [],
      };
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
      refundTicketsArray: TicketsArrayInterface[],
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
         lotteryParticipateUsers: refundTicketsArray || [],
         winners: [],
      }).save();

      console.log('createLotteryGameLobby =>', createLotteryGameLobby);
   }

   @Cron('*/3 * * * *')
   async handleCron() {
      this.logger.debug('Called when the current second');

      const findDocuments = await this.lotteryGameModel.countDocuments();
      const defaultGameId = +process.env.DEFAULT_LOTTERY_GAME_ID;
      // get the tomorrow date.
      const nextRoundDate = this.getTomorrowDate();

      // find the previous game information
      const lottery = await this.lotteryGameModel.findOne({
         gameId: findDocuments + defaultGameId - 1,
      });

      const lotteryUsers = await this.lotteryGameUsersModel.findOne({
         gameId: findDocuments + defaultGameId - 1,
      });

      const { refundTicketsArray, winnersTicketsArray } =
         await this.updateLotteryResult(lottery, lotteryUsers);

      console.log({ refundTicketsArray, winnersTicketsArray });

      // genrate the next game id and _id.
      const gameId = findDocuments + defaultGameId;
      const _id = new mongoose.Types.ObjectId();

      if (!!winnersTicketsArray && winnersTicketsArray.length) {
         const storeAllLotteryWinners =
            await this.lotteryGameUsersModel.updateOne(
               { gameId: findDocuments + defaultGameId - 1 },
               { $set: { winners: winnersTicketsArray || [] } },
            );

         console.log('storeAllLotteryWinners =>', storeAllLotteryWinners);
      }

      const updateTodayLottery = await this.lotteryGameModel.updateOne(
         { gameId: findDocuments + defaultGameId - 1 },
         { $set: { lotteryPollResultShow: true } },
      );

      if (!updateTodayLottery) {
         this.logger.error('updateTodayLottery =>', updateTodayLottery);
      }

      await this.genrateNewGame(gameId, _id, nextRoundDate, refundTicketsArray);
   }
}
