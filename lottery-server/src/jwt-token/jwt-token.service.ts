import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtTokenService {
   constructor(private readonly jwtService: JwtService) {}

   /**
    * @generateAccessToken function is a method that generates a JSON Web Token (JWT)
    * based on the provided payload, expiration time (expiresIn), and secret.
    * This function is typically used in an authentication service or module to
    * generate access tokens for authenticated users.
    * @payload ( Object ) The payload data that will be embedded in the JWT. It can contain any
    * valid JSON data representing the user's identity or any additional information
    * related to the token.
    * @expiresIn ( string ) The expiration time of the JWT token. It should be provided
    * in a format supported by the jsonwebtoken library. For example,
    * '1h' indicates the token will expire in one hour, '7d' indicates the token will
    * expire in seven days, etc.
    * @secret ( string ) The secret key used to sign the JWT. This key should be kept
    * secure and should not be exposed to unauthorized users.
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
    * @validateAccessToken function is a method used to verify the authenticity and
    * validity of a JSON Web Token (JWT). It checks whether the provided token is properly
    * signed and has not expired. This function is typically part of an authentication service
    * or module to validate tokens before granting access to protected resources.
    * @token ( string ) The JWT token to be validated. It is usually extracted from the request
    * headers or other sources.
    * @secret ( string | Buffer ) The secret key used to verify the authenticity of the JWT.
    * This key should match the one used during token generation to properly validate the
    * signature.
    * @returns The function returns a Promise that resolves to a boolean value.
    * If the token is valid, it returns true; otherwise, it throws a ForbiddenException
    * with an error message indicating that the token has expired or is invalid.
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
    * @getToken function is a method used to extract a JSON Web Token (JWT) from the request
    * headers. It is typically part of an authentication service or module, designed to
    * retrieve the JWT token from the HTTP request and prepare it for further processing,
    * such as validation or authentication.
    * @req ( Request ) The HTTP request object from which the JWT token will be extracted.
    * The Request object is usually provided by the web framework or middleware (e.g., Express)
    * and contains information about the incoming HTTP request.
    * @returns { token: string | null } The function returns an object with a single property
    * token, which contains the extracted JWT token as a string or null if the token cannot be
    * found or is not properly formatted.
    */
   getToken(req: Request): { token: string | null } {
      const authorization: string = req['authorization'];
      if (!authorization) return { token: null };
      const token = authorization.split(' ');
      if (token.length !== 2) return { token: null };
      return { token: token[1] };
   }

   /**
    * @getTokenPayload function is a method used to decode the payload of a JSON Web Token (JWT).
    * It is typically part of an authentication service or module, designed to retrieve the
    * decoded payload data from the JWT token for further processing or verification.
    * @token ( string ) The JWT token from which the payload will be extracted and decoded.
    * @returns { [key: string]: any } The function returns an object representing the decoded
    * payload data. The payload is usually a JSON object containing various properties related to
    * the authenticated user or other relevant information.
    */
   getTokenPayload(token: string): { [key: string]: any } {
      const payload = this.jwtService.decode(token) as { id: string };
      return payload;
   }
}
