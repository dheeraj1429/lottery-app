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
   SingleLuckyDrawUsersListDto,
   UpdateLotteryResultDto,
   getUserLotteryDtos,
} from './dtos/lucky-draw.dtos';
import { LotteryUsers } from 'src/tasks/schemas/lotteryUsers.schema';
import axios from 'axios';
import { AccountConfig } from 'src/account-config/schemas/account-config.schema';
import { GetMyWinningDto } from './dtos/lucky-draw.dtos';

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
            _id: new mongoose.Types.ObjectId(),
            createdAt: new Date(),
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
         type: 'buyLotteryTickets',
      });

      if (response && !!response?.data && response?.data?.success) {
         let tickets = !!isManually
            ? [
                 {
                    ...userLotteryData?.[0],
                    clientId,
                    _id: new mongoose.Types.ObjectId(),
                    createdAt: new Date(),
                 },
              ]
            : this.genrateUniqueNumbers(userId, numberOfTickets, clientId);

         let findLotterPollAndPlaceTicket = await this.lotteryUsers.updateOne(
            { gameId },
            {
               $push: {
                  lotteryParticipateUsers: tickets,
               },
            },
         );

         if (findLotterPollAndPlaceTicket.modifiedCount) {
            const responseData = responseObject(true, false, {
               message:
                  'Congratulations  your lottery ticket is placed. Good luck',
               tickets: !!isManually ? userLotteryData : tickets.reverse(),
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

   async singleLuckyDrawUsersList(
      data: SingleLuckyDrawUsersListDto,
      res: Response,
   ) {
      const { gameId, filter, page } = data;

      const isValidId = checkIsValidId(gameId);

      if (!isValidId) {
         const error = responseObject(false, true, {
            message: 'Please provide valid gameId',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(error);
      }

      const DOCUMENT_LIMIT = 30;
      const findLottery = await this.lotteryUsers.aggregate([
         { $match: { lotteryGameId: new mongoose.Types.ObjectId(gameId) } },
         {
            $project: {
               createdAt: 1,
               item: {
                  $cond: {
                     if: { $eq: [filter, 'participate'] },
                     then: '$lotteryParticipateUsers',
                     else: '$winners',
                  },
               },
            },
         },
         { $addFields: { numberOfDocuments: { $size: '$item' } } },
         { $unwind: { path: '$item', preserveNullAndEmptyArrays: true } },
         { $sort: { 'item.createdAt': -1 } },
         { $skip: page * DOCUMENT_LIMIT },
         { $limit: DOCUMENT_LIMIT },
         {
            $project: {
               'item.numberOfTickets': 1,
               'item.lotteryNumbers': 1,
               'item.price': {
                  $cond: {
                     if: { $eq: [{ $type: '$item.price' }, 'missing'] },
                     then: '$$REMOVE',
                     else: {
                        $convert: {
                           input: '$item.price',
                           to: 'string',
                        },
                     },
                  },
               },
               'item.isUsed': 1,
               'item.refundTicket': 1,
               'item._id': 1,
               'item.createdAt': 1,
               'item.userId': 1,
               'item.clientId': 1,
               numberOfDocuments: 1,
            },
         },
         {
            $group: {
               _id: { _id: '$_id', numberOfDocuments: '$numberOfDocuments' },
               lotteryData: {
                  $push: {
                     $cond: {
                        if: {
                           $ne: [{ $ifNull: ['$item.price', null] }, null],
                        },
                        then: '$item',
                        else: '$$REMOVE',
                     },
                  },
               },
            },
         },
         { $project: { lottery: '$_id', _id: 0, lotteryData: 1 } },
      ]);

      const lotteryUserList = findLottery?.[0];

      if (!lotteryUserList) {
         const error = responseObject(false, true, {
            message: 'No data found.',
         });
         return res.status(HttpStatus.NOT_FOUND).json(error);
      }

      const response = responseObject(true, false, {
         items: lotteryUserList,
         page: +page,
         totalPages: Math.ceil(
            lotteryUserList?.lottery?.numberOfDocuments / DOCUMENT_LIMIT - 1,
         ),
      });

      return res.status(HttpStatus.OK).json(response);
   }

   async getLotteryResult(res: Response) {
      const defaultGameId = +process.env.DEFAULT_LOTTERY_GAME_ID;
      // find all create document number.
      const findDocuments = await this.lotteryGame.countDocuments();
      //find yesturday game id.
      const yesturdayGameId = defaultGameId + findDocuments - 2;

      const findLotterPoll = await this.lotteryGame.aggregate([
         { $match: { gameId: { $eq: yesturdayGameId } } },
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

      const data = findLotterPoll?.[0] ? findLotterPoll?.[0] : [];

      if (!data) {
         const error = responseObject(false, true, { message: 'Not found' });
         return res.status(HttpStatus.NOT_FOUND).json(error);
      }

      const responseData = responseObject(true, false, { item: data });
      return res.status(HttpStatus.OK).json(responseData);
   }

   async getMyLotterywinning(data: GetMyWinningDto, res: Response) {
      const { page, userId } = data;

      const DOCUMENT_LIMIT = 10;

      const countDocuments = await this.lotteryUsers.aggregate([
         { $unwind: { path: '$winners', preserveNullAndEmptyArrays: true } },
         { $match: { 'winners.userId': { $eq: userId } } },
         { $group: { _id: null, count: { $sum: 1 } } },
      ]);

      const myWinnings = await this.lotteryUsers.aggregate([
         { $unwind: { path: '$winners', preserveNullAndEmptyArrays: true } },
         { $match: { 'winners.userId': { $eq: userId } } },
         {
            $project: {
               _id: 1,
               lotteryGameId: 1,
               'winners.price': {
                  $cond: {
                     if: { $ne: [{ $ifNull: ['$winners.price', null] }, null] },
                     then: {
                        $convert: { input: '$winners.price', to: 'string' },
                     },
                     else: '$$REMOVE',
                  },
               },
               'winners.lotteryNumbers': 1,
               'winners.isUsed': 1,
               'winners.createdAt': 1,
               'winners.numberOfTickets': 1,
               'winners.matches': 1,
               'winners.jackpotBallNumberMatch': 1,
               'winners.numbersMatches': {
                  $cond: {
                     if: { $gte: [{ $type: '$winners.matches' }, 'missing'] },
                     then: '$$REMOVE',
                     else: {
                        $sum: [
                           { $size: '$winners.matches' },
                           {
                              $cond: {
                                 if: {
                                    $gte: [
                                       {
                                          $type: '$winners.jackpotBallNumberMatch',
                                       },
                                       'missing',
                                    ],
                                 },
                                 then: 0,
                                 else: 1,
                              },
                           },
                        ],
                     },
                  },
               },
            },
         },
         { $sort: { 'winners.createdAt': -1 } },
         { $skip: page * DOCUMENT_LIMIT },
         { $limit: DOCUMENT_LIMIT },
         {
            $group: {
               _id: '$winners.userId',
               winners: {
                  $push: {
                     $cond: {
                        if: { $eq: [{ $ifNull: ['$winners', {}] }, {}] },
                        then: '$$REMOVE',
                        else: '$winners',
                     },
                  },
               },
            },
         },
         { $project: { _id: 0, winnings: '$winners' } },
      ]);

      const winningData = myWinnings?.[0];

      if (!winningData) {
         const response = responseObject(false, true, { winningData: {} });
         return res.status(HttpStatus.OK).json(response);
      }

      const response = responseObject(true, false, {
         winningData,
         page: +page,
         totalPages: Math.ceil(countDocuments?.[0]?.count / DOCUMENT_LIMIT - 1),
      });
      return res.status(HttpStatus.OK).json(response);
   }

   async getMyAllLotteryTickets(query: GetMyWinningDto, res: Response) {
      const { userId, page } = query;
      const DOCUMENT_LIMIT = 10;

      const unwindFilter = {
         $unwind: {
            path: '$lotteryParticipateUsers',
            preserveNullAndEmptyArrays: false,
         },
      };

      const matchFilter = {
         $match: {
            $and: [
               { 'lotteryParticipateUsers.userId': userId },
               { 'lotteryParticipateUsers.refundTicket': false },
            ],
         },
      };

      const documentCounts = await this.lotteryUsers.aggregate([
         { ...unwindFilter },
         { ...matchFilter },
         { $count: 'totalDocuments' },
      ]);

      const lotteryTickets = await this.lotteryUsers.aggregate([
         { ...unwindFilter },
         { ...matchFilter },
         { $sort: { 'lotteryParticipateUsers.createdAt': -1 } },
         { $skip: +page * DOCUMENT_LIMIT },
         { $limit: DOCUMENT_LIMIT },
         {
            $project: {
               userId: '$lotteryParticipateUsers.userId',
               numberOfTickets: '$lotteryParticipateUsers.numberOfTickets',
               lotteryNumbers: '$lotteryParticipateUsers.lotteryNumbers',
               isUsed: '$lotteryParticipateUsers.isUsed',
               refundTicket: '$lotteryParticipateUsers.refundTicket',
               createdAt: '$lotteryParticipateUsers.createdAt',
               gameId: 1,
            },
         },
      ]);

      if (!lotteryTickets) {
         const error = responseObject(false, true, {
            message: 'No data found.',
         });
         return res.status(HttpStatus.NOT_FOUND).json(error);
      }

      const response = responseObject(true, false, {
         items: lotteryTickets,
         page: +page,
         totalPages: Math.ceil(
            documentCounts?.[0]?.totalDocuments / DOCUMENT_LIMIT - 1,
         ),
      });

      return res.status(HttpStatus.OK).json(response);
   }
}
