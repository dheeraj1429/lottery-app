import { Module } from '@nestjs/common';
import { AccountConfigService } from './account-config.service';
import { AccountConfigController } from './account-config.controller';
import { JwtTokenModule } from 'src/jwt-token/jwt-token.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
   AccountConfig,
   AccountConfigSchema,
} from './schemas/account-config.schema';

@Module({
   imports: [
      JwtTokenModule,
      MongooseModule.forFeature([
         { name: AccountConfig.name, schema: AccountConfigSchema },
      ]),
   ],

   providers: [AccountConfigService],

   controllers: [AccountConfigController],

   exports: [],
})
export class AccountConfigModule {}
