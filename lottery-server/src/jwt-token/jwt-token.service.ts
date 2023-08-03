import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtTokenService {
   constructor(private readonly jwtService: JwtService) {}

   /**
    * generate the access token for the authenticated users
    * @param payload the payload is basically a object with the user information like which properties user wants to store inside the token.
    * @param expiresIn token expiration time.
    * @param secret  token secret.
    * @returns token as a string
    */
   async genrateAccessToken(
      payload: any,
      expiresIn: string,
      secret: string,
   ): Promise<string> {
      const token = await this.jwtService.sign(payload, { expiresIn, secret });
      return token;
   }

   /**
    * validate the access token for the authenticated users
    * @param token jwt token to validate user.
    * @param secret jwt token secrer
    * @returns
    */
   async validateAccessToken(
      token: string,
      secret: string | Buffer,
   ): Promise<boolean> {
      const validate = await this.jwtService.verify(token, { secret });
      if (!validate) throw new ForbiddenException('Token expire');
      return true;
   }

   /**
    * retrun the user access token from the headers. if the has no valid token then throw an error.
    * @param req Request object with headers and body
    * @returns { token: null || string }
    */
   getToken(req: Request): { token: string | null } {
      const authorization: string = req['authorization'];
      if (!authorization) return { token: null };
      const token = authorization.split(' ');
      if (token.length !== 2) return { token: null };
      return { token: token[1] };
   }

   /**
    * @param token access token.
    * @returns token payload which contains all the token information.
    */
   getTokenPayload(token: string) {
      const payload = this.jwtService.decode(token) as { id: string };
      return payload;
   }
}
