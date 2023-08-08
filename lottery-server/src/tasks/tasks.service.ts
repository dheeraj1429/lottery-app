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

   /**
    * @updateUserInformation function is an asynchronous utility used to update user information, particularly the price and user ID,
    * via an API endpoint. It sends a POST request to the specified API URL with the provided data and returns a response indicating the
    * success or failure of the update operation.
    * @price (string): The price or amount in USD to be updated for the user.
    * @userId (string): The unique identifier of the user whose information is to be updated.
    * @updateApiUrl (string): The URL of the API endpoint where the update request will be sent.
    * @returns A Promise that resolves to an object containing the response from the API call. The response object has the
    * following structure:
    *
    * This function relies on the Axios library for making HTTP requests.
    * The function will return an object indicating an error if the updateApiUrl parameter is not provided.
    * The function assumes that the API endpoint expects a JSON payload with the amountInUsd and userId properties.
    */
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
   }

   /**
    * @updateLotteryResult function processes lottery participation data and updates user information
    * based on the lottery results. It calculates refunds and prizes for participants, considering their
    * matching numbers and the jackpot ball number.
    * @lottery A document representing the lottery game details.
    * @lotteryUsers A document containing information about users who participated in the lottery.
    *
    * @Output
    * The function returns an object with two arrays:
    * refundTicketsArray: An array containing details of tickets eligible for a refund.
    * winnersTicketsArray: An array containing details of winning tickets and their associated prizes.
    *
    * Prize Calculation and User Update: Depending on the number of matching numbers and whether the jackpot ball number matches,
    * different prize amounts are calculated and the user's information is updated using the updateUserInformation function.
    *
    * Refund Calculation: If no matches are found and the jackpot ball number is not matched, the participant's ticket is
    * eligible for a refund. This information is added to the refundTicketsArray.
    *
    * Winner Update: If the participant has matched 3, 4, or 5 numbers (with jackpot ball number match), their information is
    * added to the winnersTicketsArray along with the prize details.
    *
    * Final Output: After processing all participants, the function returns the refundTicketsArray and winnersTicketsArray
    * containing refund and winner details, respectively.
    *
    * Fallback: If either participants or lottery results are missing, the function returns empty arrays for both refunds and winners.
    *
    * The updateLotteryResult function efficiently processes lottery participation data, calculates refunds, and determines prizes
    * for participants based on their matching numbers and jackpot ball number. It handles various scenarios and updates user
    * information as necessary. The function plays a crucial role in managing the outcomes of a lottery game.
    */
   async updateLotteryResult(
      lottery: LotteryGameSchemaDocument,
      lotteryUsers: LotteryUsersDocument,
   ) {
      // The function checks if both lotteryUsers and lottery documents exist. If not, it returns empty arrays for both
      // refund and winners, indicating that no processing is necessary.
      if (!lotteryUsers && !lottery) {
         return {
            refundTicketsArray: [],
            winnersTicketsArray: [],
         };
      }

      // Data Retrieval: It extracts the lotteryParticipateUsers array from the lotteryUsers document and the
      // lotteryResult object from the lottery document.
      // Processing Participants: If participants exist (lotteryParticipateUsers) and a lottery result is available (lotteryResult),
      // the function iterates through each participant.
      const { lotteryParticipateUsers } = lotteryUsers;
      const { lotteryResult } = lottery;

      const refundTicketsArray: TicketsArrayInterface[] = [];
      const winnersTicketsArray: TicketsArrayInterface[] = [];

      const hasParticipants =
         !!lotteryParticipateUsers && !!lotteryParticipateUsers?.length;
      const hasLotterResult = !!lotteryResult;

      if (hasParticipants && hasLotterResult) {
         for (let i = 0; i < lotteryParticipateUsers?.length; i++) {
            // Participant Details: For each participant, the function extracts relevant details, such as clientId,
            // refundTicket, lotteryNumbers, numberOfTickets, and userId.
            const {
               clientId,
               refundTicket,
               lotteryNumbers,
               numberOfTickets,
               userId,
            } = lotteryParticipateUsers[i];

            const { luckyNumbers, jackpotBallNumber } = lotteryNumbers;

            const accountConfig = await this.accountConfig.findOne(
               { clientId },
               { updateClientInformationApi: 1 },
            );

            // Account Configuration Check: The function retrieves account configuration details for the participant's clientId and
            // checks if the updateClientInformationApi property is available. If not, the participant is skipped.
            if (!accountConfig || !accountConfig?.updateClientInformationApi) {
               continue;
            }

            // Matching Numbers Calculation: The function compares the participant's lucky numbers with the winning luckyNumbers
            // from the lottery result. Matching numbers are collected in the matchNumbers array.
            const matchNumbers: number[] = [];

            for (let j = 0; j < luckyNumbers.length; j++) {
               if (lotteryResult?.luckyNumbers.includes(luckyNumbers[j])) {
                  matchNumbers.push(luckyNumbers[j]);
               }
            }

            const defatulValues = {
               lotteryNumbers,
               numberOfTickets,
               userId,
               refundTicket,
            };

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

               const updateObject = {
                  ...defatulValues,
                  price,
                  isUsed: true,
                  matches: matchNumbers,
               };

               winnersTicketsArray.push(updateObject);
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

               const updateObject = {
                  ...defatulValues,
                  price,
                  isUsed: true,
                  matches: matchNumbers,
               };

               winnersTicketsArray.push(updateObject);
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

               const updateObject = {
                  ...defatulValues,
                  price,
                  isUsed: true,
                  matches: matchNumbers,
                  jackpotBallNumberMatch: lotteryResult?.jackpotBallNumber,
               };

               winnersTicketsArray.push(updateObject);
            }
         }
      } else {
         return {
            refundTicketsArray: [],
            winnersTicketsArray: [],
         };
      }

      return {
         refundTicketsArray,
         winnersTicketsArray,
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

      if (!createLotteryGame) {
         throw new Error(
            'Something worng happened while creating lottery game',
         );
      }

      // store the game numbers combination.
      const createNumberCombination = await new this.numberCombination({
         gameId,
         lotteryGameId: _id,
         combinations,
      }).save();

      if (!createNumberCombination) {
         throw new Error(
            'Something worng happened while creating number combination',
         );
      }

      // create the game user lobby.
      const createLotteryGameLobby = await new this.lotteryGameUsersModel({
         gameId,
         lotteryGameId: _id,
         lotteryParticipateUsers: refundTicketsArray || [],
         winners: [],
      }).save();

      if (!createLotteryGameLobby) {
         throw new Error(
            'Something worng happened while create lottery gameLobby',
         );
      }
   }

   @Cron('*/3 * * * *')
   async handleCron() {
      const findDocuments = await this.lotteryGameModel.countDocuments();
      const defaultGameId = +process.env.DEFAULT_LOTTERY_GAME_ID;
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

      // genrate the next game id and _id.
      const gameId = findDocuments + defaultGameId;
      const _id = new mongoose.Types.ObjectId();

      console.log('winnersTicketsArray =>', winnersTicketsArray);

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
