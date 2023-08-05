import {
   ExecutionContext,
   CanActivate,
   Injectable,
   UnauthorizedException,
} from '@nestjs/common';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';
import { GuardResponse } from '.';

/**
 * The JwtGuard class is implemented as an injectable service, meaning it can be easily
 * provided and utilized within the NestJS application. The class constructor accepts an
 * instance of JwtTokenService, which is responsible for handling JWT operations.
 * @JwtTokenService  This is a separate service responsible for parsing, validating,
 * and generating JWT tokens. The JwtGuard relies on this service to perform token-related
 * operations.
 * Create a JwtGuard class and implement the CanActivate interface
 */
@Injectable()
export class JwtGuard implements CanActivate {
   // Inject the JwtTokenService into the JwtGuard constructor
   constructor(private readonly jwtTokenService: JwtTokenService) {}

   // Implement the canActivate method required by the CanActivate interface
   canActivate(context: ExecutionContext): GuardResponse {
      // method is used to retrieve the current HTTP request from the ExecutionContext.
      // This is necessary to access the request headers and retrieve the JWT token.
      // Get the current HTTP request from the execution context
      const request = context.switchToHttp().getRequest();

      // Extract the JWT token from the request headers using JwtTokenService
      const authorization = this.jwtTokenService.getToken(request.headers);

      // If there's no token in the request headers, throw an UnauthorizedException
      if (!authorization.token) throw new UnauthorizedException();

      // Validate the extracted token using the JwtTokenService
      const isValide = this.jwtTokenService.validateAccessToken(
         authorization?.token,
         process.env.ACCESS_TOKEN_SECRET,
      );

      // If the token is valid, return true, else return false
      if (isValide) return true;

      // If the token is invalid, throw an UnauthorizedException and return false
      return false;
   }
}
