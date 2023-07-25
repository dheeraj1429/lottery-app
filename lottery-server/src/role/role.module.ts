import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { JwtTokenModule } from 'src/jwt-token/jwt-token.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schemas/role.schema';
import AuthSchema, { Auth } from 'src/auth/schemas/auth.schema';

@Module({
   imports: [
      JwtTokenModule,

      MongooseModule.forFeature([
         { name: Role.name, schema: RoleSchema },
         { name: Auth.name, schema: AuthSchema },
      ]),
   ],

   providers: [RoleService],

   controllers: [RoleController],

   exports: [RoleService],
})
export class RoleModule {}
