import { Module } from '@nestjs/common';
import { JwtTokenService } from './jwt-token.service';
import { JwtTokenController } from './jwt-token.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
   imports: [JwtModule],

   providers: [JwtTokenService],

   controllers: [JwtTokenController],

   exports: [JwtTokenService],
})
export class JwtTokenModule {}
