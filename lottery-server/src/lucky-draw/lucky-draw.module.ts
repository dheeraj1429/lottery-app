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
import { RoleModule } from 'src/role/role.module';
import {
   AccountConfig,
   AccountConfigSchema,
} from 'src/account-config/schemas/account-config.schema';

@Module({
   imports: [
      JwtTokenModule,

      RoleModule,

      MongooseModule.forFeature([
         { name: LotteryGame.name, schema: LotteryGameSchema },
         { name: LotteryUsers.name, schema: lotteryUsersSchema },
         { name: AccountConfig.name, schema: AccountConfigSchema },
      ]),
   ],

   controllers: [LuckyDrawController],

   providers: [LuckyDrawService],

   exports: [],
})
export class LuckyDrawModule {}
