import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';
import { AuthDto } from './dtos/auth.dtos';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from './schemas/auth.schema';
import { Model } from 'mongoose';
import { responseObject } from 'src/utils/helper';

@Injectable()
export class AuthService {
   constructor(
      @InjectModel(Auth.name) private readonly authModel: Model<Auth>,
      private readonly jwtTokenService: JwtTokenService,
   ) {}

   // login with credentials
   async signIn(data: AuthDto, res: Response) {
      const { email, password } = data;

      // find the account associated with the email
      const account = await this.authModel.findOne({ email });

      if (!account) {
         const error = responseObject(false, true, {
            message: 'Account not found',
         });
         return res.status(HttpStatus.NOT_FOUND).json(error);
      }

      // check if the password is correct
      const isMatch = await bcrypt.compare(password, account.password);

      if (!isMatch) {
         const error = responseObject(false, true, {
            message: 'Account password is incorrect',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(error);
      }

      // if user is found and password is right create a token
      const token = await this.jwtTokenService.genrateAccessToken(
         { id: account._id },
         '10d',
         process.env.ACCESS_TOKEN_SECRET,
      );

      // return the information including token as JSON
      const response = responseObject(true, false, {
         accessToken: token,
         account: {
            _id: account?._id,
            email: account.email,
            avatar: account.avatar,
         },
      });
      return res.status(HttpStatus.CREATED).json(response);
   }

   // create new account
   async signUp(data: AuthDto, res: Response) {
      const { email, password } = data;

      // find the account is already exists or not.
      const account = await this.authModel.findOne({ email }, { email: 1 });

      if (account) {
         const error = responseObject(false, true, {
            message: 'Account already exists',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(error);
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newAccount = await new this.authModel({
         email,
         password: hashedPassword,
      }).save();

      if (!newAccount) {
         const error = responseObject(false, true, {
            message: 'Something went wrong',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(error);
      }

      // genrate the jwt token.
      const token = await this.jwtTokenService.genrateAccessToken(
         { _id: newAccount?._id },
         '10d',
         process.env.ACCESS_TOKEN_SECRET,
      );

      const response = responseObject(true, false, {
         accessToken: token,
         account: {
            _id: account?._id,
            email: newAccount.email,
            avatar: newAccount.avatar,
         },
      });
      return res.status(HttpStatus.CREATED).json(response);
   }
}
