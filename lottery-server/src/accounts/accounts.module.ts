import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtTokenModule } from 'src/jwt-token/jwt-token.module';
import {
   AccountConfig,
   AccountConfigSchema,
} from 'src/account-config/schemas/account-config.schema';
import { RoleService } from 'src/role/role.service';
import { RoleModule } from 'src/role/role.module';
import AuthSchema, { Auth } from 'src/auth/schemas/auth.schema';

@Module({
   imports: [
      JwtTokenModule,

      MongooseModule.forFeature([
         { name: Auth.name, schema: AuthSchema },
         { name: AccountConfig.name, schema: AccountConfigSchema },
      ]),

      RoleModule,
   ],

   providers: [AccountsService],

   controllers: [AccountsController],

   exports: [],
})
export class AccountsModule {}
