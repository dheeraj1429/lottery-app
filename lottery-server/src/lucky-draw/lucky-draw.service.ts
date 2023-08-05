import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import mongoose, { Model } from 'mongoose';
import { LotteryGame } from 'src/tasks/schemas/lotteryGame.schema';
import {
   checkIsValidId,
   generateUniqueRandomNumbers,
   responseObject,
} from 'src/utils/helper';
import {
   BuyLotteryTicketsDto,
   GetAllLotteryDrawDto,
   GetSingleLotteryDrawDto,
   UpdateLotteryResultDto,
   getUserLotteryDtos,
} from './dtos/lucky-draw.dtos';
import { LotteryUsers } from 'src/tasks/schemas/lotteryUsers.schema';
import axios from 'axios';
import { AccountConfig } from 'src/account-config/schemas/account-config.schema';

@Injectable()
export class LuckyDrawService {
   constructor(
      @InjectModel(LotteryGame.name)
      private readonly lotteryGame: Model<LotteryGame>,
      @InjectModel(LotteryUsers.name)
      private readonly lotteryUsers: Model<LotteryUsers>,
      @InjectModel(AccountConfig.name)
      private readonly accountConfig: Model<AccountConfig>,
   ) {}

   genrateUniqueNumbers = function (
      userId: string,
      numberOfTickets: number,
      clientId: string,
   ) {
      const newLotteryData = new Array(numberOfTickets).fill({}).map(() => {
         const uniqueAr = generateUniqueRandomNumbers(5, 1, 36);

         return {
            userId,
            numberOfTickets: 1,
            lotteryNumbers: {
               luckyNumbers: uniqueAr,
               jackpotBallNumber: Math.floor(Math.random() * 10 + 1),
            },
            clientId,
         };
      });

      return newLotteryData;
   };

   async getTodayLottery(res: Response) {
      const defaultGameId = +process.env.DEFAULT_LOTTERY_GAME_ID;

      const findDocuments = await this.lotteryGame.countDocuments();

      const todayLotteryPoll = await this.lotteryGame.aggregate([
         { $match: { gameId: findDocuments + defaultGameId - 1 } },
         { $project: { createdAt: 1, lotteryResultTime: 1, gameId: 1 } },
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

   async buyLotteryTickets(data: BuyLotteryTicketsDto, res: Response) {
      const {
         amount,
         gameId,
         userLotteryData,
         isManually,
         numberOfTickets,
         userId,
         clientId,
      } = data;

      if (!amount || !gameId) {
         const error = responseObject(false, true, {
            message: 'Please provide amount and gameId',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(error);
      }

      // find the account config document which contains the user update information api url.
      const accountConfig = await this.accountConfig.findOne(
         { clientId },
         { updateClientInformationApi: 1 },
      );

      if (!accountConfig || !accountConfig?.updateClientInformationApi) {
         const error = responseObject(false, true, {
            message: 'Account Config not found',
         });
         return res.status(HttpStatus.NOT_FOUND).json(error);
      }

      const { updateClientInformationApi } = accountConfig;

      const response = await axios.post<{
         success: boolean;
         error: boolean;
         message: string;
      }>(updateClientInformationApi, {
         amountInUsd: amount,
         userId: userId,
      });

      if (response && !!response?.data && response?.data?.success) {
         let tickets = !!isManually
            ? {
                 ...userLotteryData?.[0],
                 price: 0,
                 isUsed: false,
                 refundTicket: false,
                 createdAt: new Date(),
                 clientId,
              }
            : this.genrateUniqueNumbers(userId, numberOfTickets, clientId);

         let findLotterPollAndPlaceTicket = await this.lotteryUsers.updateOne(
            { gameId },
            { $push: { lotteryParticipateUsers: tickets } },
         );

         if (findLotterPollAndPlaceTicket.modifiedCount) {
            const responseData = responseObject(true, false, {
               message:
                  'Congratulations  your lottery ticket is placed. Good luck',
               tickets: !!isManually ? userLotteryData : tickets,
            });
            return res.status(HttpStatus.OK).json(responseData);
         }

         const error = responseObject(false, true, {
            message: 'Something went wrong. please try again later',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(error);
      }

      const error = responseObject(false, true, {
         message: response?.data?.message,
      });
      return res.status(HttpStatus.BAD_REQUEST).json(error);
   }

   async getUserLotteryTickets(data: getUserLotteryDtos, res: Response) {
      const { userId, gameId, page } = data;

      if (!userId || !gameId || !page) {
         const error = responseObject(false, true, {
            message: 'Please provide userId, gameId and page',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(error);
      }

      const isValidIdGameId = checkIsValidId(gameId);
      if (!isValidIdGameId) {
         const error = responseObject(false, true, {
            message: 'Please provide valid gameId',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(error);
      }

      const DOCUMENT_LIMIT = 10;

      const findUserTodayLotteryTicket = await this.lotteryUsers.aggregate([
         { $match: { lotteryGameId: new mongoose.Types.ObjectId(gameId) } },
         {
            $project: {
               tickets: {
                  $filter: {
                     input: '$lotteryParticipateUsers',
                     as: 'item',
                     cond: {
                        $eq: ['$$item.userId', userId],
                     },
                  },
               },
            },
         },
         { $addFields: { totalDocuments: { $size: '$tickets' } } },
         { $unwind: { path: '$tickets', preserveNullAndEmptyArrays: true } },
         { $sort: { 'tickets.createdAt': -1 } },
         { $skip: +page * DOCUMENT_LIMIT },
         { $limit: DOCUMENT_LIMIT },
         {
            $project: {
               _id: 1,
               'tickets.userId': 1,
               'tickets.numberOfTickets': 1,
               'tickets.lotteryNumbers': 1,
               'tickets.price': {
                  $cond: {
                     if: { $eq: [{ $type: '$tickets.price' }, 'missing'] },
                     then: '$$REMOVE',
                     else: {
                        $convert: {
                           input: '$tickets.price',
                           to: 'string',
                        },
                     },
                  },
               },
               'tickets.isUsed': 1,
               'tickets.refundTicket': 1,
               'tickets._id': 1,
               'tickets.createdAt': 1,
               totalDocuments: 1,
            },
         },
         {
            $group: {
               _id: { _id: '$_id', totalDocuments: '$totalDocuments' },
               tickets: {
                  $push: {
                     $cond: {
                        if: {
                           $ne: [{ $ifNull: ['$tickets.price', null] }, null],
                        },
                        then: '$tickets',
                        else: '$$REMOVE',
                     },
                  },
               },
            },
         },
         { $project: { _id: 0, tickets: '$tickets', item: '$_id' } },
      ]);

      const ticketsData = findUserTodayLotteryTicket?.[0];

      if (ticketsData) {
         const responseData = responseObject(true, false, {
            item: ticketsData,
            page: +page,
            totalPages: Math.ceil(
               ticketsData?.item?.totalDocuments / DOCUMENT_LIMIT - 1,
            ),
         });
         return res.status(HttpStatus.OK).json(responseData);
      }

      const error = responseObject(false, true, { message: 'User not found!' });
      return res.status(HttpStatus.NOT_FOUND).json(error);
   }

   async getAllLotteryDraw(data: GetAllLotteryDrawDto, res: Response) {
      const { page } = data;
      const DOCUMENT_LIMIT = 9;
      const countDocuments = await this.lotteryGame.countDocuments();

      const allLottery = await this.lotteryGame.aggregate([
         { $sort: { createdAt: -1 } },
         { $skip: +page * DOCUMENT_LIMIT },
         { $limit: DOCUMENT_LIMIT },
         {
            $project: {
               gameId: 1,
               lotteryResultTime: 1,
               lotteryResult: 1,
               lotteryResultShow: 1,
               createdAt: 1,
            },
         },
      ]);

      if (allLottery) {
         const responseData = responseObject(true, false, {
            items: allLottery,
            totalDocuments: countDocuments,
            totalPages: Math.ceil(countDocuments / DOCUMENT_LIMIT - 1),
            page: +page,
         });
         return res.status(HttpStatus.OK).json(responseData);
      }

      const error = responseObject(false, true, {
         message: 'No records found',
      });

      return res.status(HttpStatus.BAD_REQUEST).json(error);
   }

   async getSingleLotteryDraw(data: GetSingleLotteryDrawDto, res: Response) {
      const { gameId } = data;
      const isValidIdGameId = checkIsValidId(gameId);
      if (!isValidIdGameId) {
         const error = responseObject(false, true, {
            message: 'Please provide valid gameId',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(error);
      }

      const findLottery = await this.lotteryGame.aggregate([
         { $match: { _id: new mongoose.Types.ObjectId(gameId) } },
      ]);
      const lotteryGame = findLottery?.[0];

      if (!lotteryGame) {
         const error = responseObject(false, true, {
            message: 'No records found',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(error);
      }

      const responseData = responseObject(true, false, { item: lotteryGame });
      return res.status(HttpStatus.OK).json(responseData);
   }

   async updateLotteryResult(data: UpdateLotteryResultDto, res: Response) {
      const { gameId, optionalNumbers, jackpotBall } = data;
      const isValidId = checkIsValidId(gameId);
      if (!isValidId) {
         const error = responseObject(false, true, {
            message: 'Please provide valid gameId',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(error);
      }

      const findAndUpdateResult = await this.lotteryGame.updateOne(
         { _id: gameId },
         {
            $set: {
               lotteryResult: {
                  luckyNumbers: optionalNumbers,
                  jackpotBallNumber: jackpotBall,
               },
            },
         },
      );

      if (findAndUpdateResult.modifiedCount) {
         const response = responseObject(true, false, {
            message: 'Result updated',
         });
         return res.status(HttpStatus.OK).json(response);
      }

      const error = responseObject(false, true, {
         message: 'No Changes',
      });
      return res.status(HttpStatus.BAD_REQUEST).json(error);
   }

   genrateArray(count: number) {
      return new Array(count)
         .fill(0)
         .map((_, idx) => ({ name: idx + 1, count: 0 }));
   }

   async getSingleLotteryUsersLuckyNumbers(
      data: GetSingleLotteryDrawDto,
      res: Response,
   ) {
      const { gameId } = data;
      const isValidId = checkIsValidId(gameId);
      if (!isValidId) {
         const error = responseObject(false, true, {
            message: 'Please provide valid gameId',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(error);
      }

      const findDocuments = await this.lotteryUsers.aggregate([
         { $match: { lotteryGameId: new mongoose.Types.ObjectId(gameId) } },
         {
            $unwind: {
               path: '$lotteryParticipateUsers',
               preserveNullAndEmptyArrays: true,
            },
         },
         {
            $unwind: {
               path: '$lotteryParticipateUsers.lotteryNumbers.luckyNumbers',
               preserveNullAndEmptyArrays: true,
            },
         },
         {
            $group: {
               _id: '$lotteryParticipateUsers.lotteryNumbers.luckyNumbers',
               count: { $sum: 1 },
            },
         },
         { $project: { _id: 0, name: '$_id', count: 1 } },
         { $sort: { name: 1 } },
      ]);

      if (findDocuments) {
         const responseData = responseObject(true, false, {
            items: findDocuments?.[0]?.name
               ? findDocuments
               : this.genrateArray(36),
         });

         return res.status(HttpStatus.OK).json(responseData);
      }

      const error = responseObject(false, true, {
         message: 'No records found',
      });
      return res.status(HttpStatus.BAD_REQUEST).json(error);
   }

   async lotteryUsersJackpotNumbers(
      data: GetSingleLotteryDrawDto,
      res: Response,
   ) {
      const { gameId } = data;

      const isValidId = checkIsValidId(gameId);

      if (!isValidId) {
         const error = responseObject(false, true, {
            message: 'Please provide valid gameId',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(error);
      }

      const findDocuments = await this.lotteryUsers.aggregate([
         { $match: { lotteryGameId: new mongoose.Types.ObjectId(gameId) } },
         {
            $unwind: {
               path: '$lotteryParticipateUsers',
               preserveNullAndEmptyArrays: true,
            },
         },
         {
            $group: {
               _id: '$lotteryParticipateUsers.lotteryPollNumbers.jackpotBallNumber',
               count: { $sum: 1 },
            },
         },
         { $project: { _id: 0, name: '$_id', count: 1 } },
         { $sort: { name: 1 } },
      ]);

      if (findDocuments) {
         const responseData = responseObject(true, false, {
            items: findDocuments?.[0]?.name
               ? findDocuments
               : this.genrateArray(10),
         });

         return res.status(HttpStatus.OK).json(responseData);
      }

      const error = responseObject(false, true, {
         message: 'No records found',
      });
      return res.status(HttpStatus.BAD_REQUEST).json(error);
   }
}
