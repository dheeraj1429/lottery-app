import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, {
   Decimal128,
   Document,
   HydratedDocument,
   ObjectId,
} from 'mongoose';

export type LotteryUsersDocument = HydratedDocument<LotteryUsers>;

@Schema()
export class LotteryUsers extends Document {
   @Prop({ type: Number })
   gameId: number;

   @Prop({ type: mongoose.Types.ObjectId, required: true, ref: 'LotteryGame' })
   lotteryGameId: ObjectId;

   @Prop({ type: Date, default: Date.now })
   createdAt: Date;

   @Prop({
      type: [
         {
            userId: { type: String, required: true },
            numberOfTickets: { type: Number, required: true, default: 1 },
            lotteryNumbers: {
               luckyNumbers: [{ type: Number }],
               jackpotBallNumber: { type: Number },
            },
            price: { type: mongoose.Types.Decimal128, default: 0 },
            isUsed: { type: Boolean, default: false },
            refundTicket: { type: Boolean, default: false },
            createdAt: { type: Date, default: Date.now },
            clientId: { type: String, required: true },
         },
      ],
   })
   lotteryParticipateUsers: {
      userId: string;
      numberOfTickets: number;
      lotteryNumbers: {
         luckyNumbers: number[];
         jackpotBallNumber: number;
      };
      price: Decimal128;
      isUsed: boolean;
      refundTicket: boolean;
      createdAt: Date;
      clientId: string;
   }[];

   @Prop({
      type: [
         {
            userId: { type: String, required: true },
            numberOfTickets: { type: Number, default: 1 },
            lotteryNumbers: {
               luckyNumbers: [{ type: Number }],
               jackpotBallNumber: { type: Number },
            },
            price: { type: mongoose.Types.Decimal128, default: 0 },
            isUsed: { type: Boolean, default: false },
            createdAt: { type: Date, default: Date.now },
            matches: [{ type: Number }],
            jackpotBallNumberMatch: { type: Number },
            clientId: { type: String, required: true },
         },
      ],
   })
   winners: {
      userId: string;
      numberOfTickets: number;
      lotteryNumbers: {
         luckyNumbers: number[];
         jackpotBallNumber: number;
      };
      price: Decimal128;
      isUsed: boolean;
      createdAt: Date;
      matches: number[];
      jackpotBallNumberMatch: number;
      clientId: string;
   }[];
}

export const lotteryUsersSchema = SchemaFactory.createForClass(LotteryUsers);

lotteryUsersSchema.index({ gameId: 1 });
lotteryUsersSchema.index({ createdAt: 1 });
lotteryUsersSchema.index({ lotteryGameId: 1 });
