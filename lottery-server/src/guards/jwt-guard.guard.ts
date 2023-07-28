import {
   ExecutionContext,
   CanActivate,
   Injectable,
   UnauthorizedException,
} from '@nestjs/common';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';
import { Observable } from 'rxjs';
export type jwtGuardResponse = boolean | Promise<boolean> | Observable<boolean>;

@Injectable()
export class JwtGuard implements CanActivate {
   constructor(private readonly jwtTokenService: JwtTokenService) {}
   canActivate(context: ExecutionContext): jwtGuardResponse {
      const request = context.switchToHttp().getRequest();
      const authorization = this.jwtTokenService.getToken(request.headers);

      if (!authorization.token) throw new UnauthorizedException();
      const isValide = this.jwtTokenService.validateAccessToken(
         authorization?.token,
         process.env.ACCESS_TOKEN_SECRET,
      );

      if (isValide) return true;
      return false;
   }
}
