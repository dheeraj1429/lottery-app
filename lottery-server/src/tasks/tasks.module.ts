import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LotteryGame, LotteryGameSchema } from './schemas/lotteryGame.schema';
import {
   LotteryUsers,
   lotteryUsersSchema,
} from './schemas/lotteryUsers.schema';
import {
   NumberCombination,
   NumberCombinationSchema,
} from './schemas/number-combinations.schema';
import { AccountConfigModule } from 'src/account-config/account-config.module';
import { AccountConfig } from 'src/account-config/schemas/account-config.schema';

@Module({
   imports: [
      MongooseModule.forFeature([
         { name: LotteryGame.name, schema: LotteryGameSchema },
         { name: LotteryUsers.name, schema: lotteryUsersSchema },
         { name: NumberCombination.name, schema: NumberCombinationSchema },
         { name: AccountConfig.name, schema: AccountConfigModule },
      ]),
   ],

   providers: [TasksService],

   controllers: [],

   exports: [],
})
export class TasksModule {}
