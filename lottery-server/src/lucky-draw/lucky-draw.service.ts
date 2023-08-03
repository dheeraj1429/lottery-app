import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import e, { Response } from 'express';
import mongoose, { Model } from 'mongoose';
import { LotteryGame } from 'src/tasks/schemas/lotteryGame.schema';
import { generateUniqueRandomNumbers, responseObject } from 'src/utils/helper';
import {
   BuyLotteryTicketsDto,
   GetAllLotteryDrawDto,
   getUserLotteryDtos,
} from './dtos/lucky-draw.dtos';
import { LotteryUsers } from 'src/tasks/schemas/lotteryUsers.schema';

@Injectable()
export class LuckyDrawService {
   constructor(
      @InjectModel(LotteryGame.name)
      private readonly lotteryGame: Model<LotteryGame>,
      @InjectModel(LotteryUsers.name)
      private readonly lotteryUsers: Model<LotteryUsers>,
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

      console.log(newLotteryData);

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

      /////////
      // call the user blc api.
      ////////

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

   async getUserLotteryTickets(data: getUserLotteryDtos, res: Response) {
      const { userId, gameId, page } = data;

      if (!userId || !gameId || !page) {
         const error = responseObject(false, true, {
            message: 'Please provide userId, gameId and page',
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
}
