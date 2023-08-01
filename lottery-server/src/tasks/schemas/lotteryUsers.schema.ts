import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, {
   Decimal128,
   Document,
   HydratedDocument,
   ObjectId,
} from 'mongoose';

export type LotteryUsersDocument = HydratedDocument<LotteryUsers>;

export class lotteryNumbers {
   @Prop({ type: [Number] })
   luckyNumbers: number[];

   @Prop({ type: Number })
   jackpotBallNumber: number;
}

export class Lottery {
   @Prop({ type: String, required: true })
   userId: string;

   @Prop({ type: Number, required: true, default: 1 })
   numberOfTickets: number;

   @Prop({ type: mongoose.Types.Decimal128, required: true, default: 0 })
   price: Decimal128;

   @Prop({ type: lotteryNumbers })
   lotteryNumbers: lotteryNumbers;

   @Prop({ type: Boolean, default: false })
   isUsed: boolean;

   @Prop({ type: Date, default: Date.now })
   createdAt: Date;
}

export class LotteryParticipateUsers extends Lottery {
   @Prop({ type: Boolean, default: false })
   refundTicket: boolean;
}

export class LotteryWinners extends Lottery {
   @Prop({ type: [Number] })
   matches: number[];

   @Prop({ type: Number })
   jackpotBallNumberMatch: number;
}

@Schema()
export class LotteryUsers extends Document {
   @Prop({ type: Number, required: true })
   gameId: number;

   @Prop({ type: mongoose.Types.ObjectId, required: true, ref: 'LotteryGame' })
   lotteryGameId: ObjectId;

   @Prop({ type: Date, default: Date.now })
   createdAt: Date;

   @Prop({ type: LotteryParticipateUsers })
   lotteryParticipateUsers: [LotteryParticipateUsers];

   @Prop({ type: LotteryWinners })
   winners: [LotteryWinners];
}

export const lotteryUsersSchema = SchemaFactory.createForClass(LotteryUsers);

lotteryUsersSchema.index({ gameId: 1 });
lotteryUsersSchema.index({ createdAt: 1 });
lotteryUsersSchema.index({ lotteryGameId: 1 });
