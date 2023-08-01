import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type LotteryGameSchemaDocument = HydratedDocument<LotteryGame>;

export class LuckyNumbersSchema {
   @Prop({ type: [Number] })
   luckyNumbers: number[];

   @Prop({ type: Number })
   jackpotBallNumber: number;
}

@Schema()
export class LotteryGame extends Document {
   @Prop({ type: Number, default: 1000, required: true, unique: true })
   gameId: number;

   @Prop({ type: Date, default: Date.now })
   createdAt: Date;

   @Prop({ type: Date, default: Date.now })
   lotteryResultTime: Date;

   @Prop({ type: LuckyNumbersSchema })
   lotteryResult: LuckyNumbersSchema;

   @Prop({ type: Boolean, default: false })
   lotteryResultShow: boolean;
}

export const LotteryGameSchema = SchemaFactory.createForClass(LotteryGame);

LotteryGameSchema.index({ gameId: 1 });
LotteryGameSchema.index({ createdAt: 1 });
LotteryGameSchema.index({ lotteryPollResultShow: 1 });
