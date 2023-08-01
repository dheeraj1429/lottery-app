import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtTokenModule } from './jwt-token/jwt-token.module';
import { RoleModule } from './role/role.module';
import { AccountConfigModule } from './account-config/account-config.module';
import { AccountsModule } from './accounts/accounts.module';
import { ClientUtilsModule } from './client-utils/client-utils.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { LuckyDrawModule } from './lucky-draw/lucky-draw.module';

@Module({
   imports: [
      ConfigModule.forRoot({
         envFilePath: ['.env.development'],
         isGlobal: true,
      }),

      MongooseModule.forRoot(process.env.DATABASE_URL),

      AuthModule,

      JwtTokenModule,

      RoleModule,

      AccountConfigModule,

      AccountsModule,

      ClientUtilsModule,

      ScheduleModule.forRoot(),

      TasksModule,

      LuckyDrawModule,
   ],

   controllers: [],

   providers: [],

   exports: [],
})
export class AppModule {}
