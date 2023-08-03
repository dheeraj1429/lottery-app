import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';

export type NumberCombinatioDocument = HydratedDocument<NumberCombination>;

@Schema()
export class NumberCombination {
   @Prop({ type: Number })
   gameId: number;

   @Prop({ type: mongoose.Types.ObjectId, ref: 'LotteryGame' })
   lotteryGameId: ObjectId;

   @Prop({ type: Date, default: Date.now })
   createdAt: Date;

   @Prop({
      type: [
         {
            luckyNumbers: [{ type: Number }],
            jackpotBallNumber: Number,
         },
      ],
   })
   combinations: { luckyNumbers: number[]; jackpotBallNumber: number }[];
}

export const NumberCombinationSchema =
   SchemaFactory.createForClass(NumberCombination);
