import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dtos/auth.dtos';

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @Post('/signIn')
   async signIn(@Body() body: AuthDto, @Res() res) {
      return this.authService.signIn(body, res);
   }

   @Post('/signUp')
   async signUp(@Body() body: AuthDto, @Res() res) {
      return this.authService.signUp(body, res);
   }
}
