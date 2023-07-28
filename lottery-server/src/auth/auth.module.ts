import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtTokenModule } from 'src/jwt-token/jwt-token.module';
import { MongooseModule } from '@nestjs/mongoose';
import AuthSchema, { Auth } from './schemas/auth.schema';
import {
   AccountConfig,
   AccountConfigSchema,
} from 'src/account-config/schemas/account-config.schema';

@Module({
   imports: [
      JwtTokenModule,

      MongooseModule.forFeature([
         { name: Auth.name, schema: AuthSchema },
         { name: AccountConfig.name, schema: AccountConfigSchema },
      ]),
   ],

   providers: [AuthService],

   controllers: [AuthController],

   exports: [],
})
export class AuthModule {}
