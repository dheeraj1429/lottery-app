import { Module } from '@nestjs/common';
import { ClientUtilsService } from './client-utils.service';
import { ClientUtilsController } from './client-utils.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
   AccountConfig,
   AccountConfigSchema,
} from 'src/account-config/schemas/account-config.schema';
import { JwtTokenModule } from 'src/jwt-token/jwt-token.module';
import AuthSchema, { Auth } from 'src/auth/schemas/auth.schema';

@Module({
   imports: [
      MongooseModule.forFeature([
         { name: Auth.name, schema: AuthSchema },
         { name: AccountConfig.name, schema: AccountConfigSchema },
      ]),

      JwtTokenModule,
   ],

   providers: [ClientUtilsService],

   controllers: [ClientUtilsController],

   exports: [],
})
export class ClientUtilsModule {}
