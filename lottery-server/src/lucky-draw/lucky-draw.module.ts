import { Module } from '@nestjs/common';
import { LuckyDrawService } from './lucky-draw.service';
import { LuckyDrawController } from './lucky-draw.controller';
import { JwtTokenModule } from 'src/jwt-token/jwt-token.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
   LotteryGame,
   LotteryGameSchema,
} from 'src/tasks/schemas/lotteryGame.schema';
import {
   LotteryUsers,
   lotteryUsersSchema,
} from 'src/tasks/schemas/lotteryUsers.schema';

@Module({
   imports: [
      JwtTokenModule,

      MongooseModule.forFeature([
         { name: LotteryGame.name, schema: LotteryGameSchema },
         { name: LotteryUsers.name, schema: lotteryUsersSchema },
      ]),
   ],

   controllers: [LuckyDrawController],

   providers: [LuckyDrawService],

   exports: [],
})
export class LuckyDrawModule {}
