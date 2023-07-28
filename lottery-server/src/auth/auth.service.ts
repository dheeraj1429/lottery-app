import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';
import { AuthDto } from './dtos/auth.dtos';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from './schemas/auth.schema';
import mongoose, { Model } from 'mongoose';
import { responseObject } from 'src/utils/helper';
import { AccountConfig } from 'src/account-config/schemas/account-config.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
   constructor(
      @InjectModel(Auth.name) private readonly authModel: Model<Auth>,
      private readonly jwtTokenService: JwtTokenService,
      @InjectModel(AccountConfig.name)
      private readonly accountConfigModel: Model<AccountConfig>,
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

      // check also the account is enable or not.
      const accountId = account?._id;
      const userAccountConfig = await this.accountConfigModel.findOne({
         userId: accountId,
      });

      if (!userAccountConfig?.accountEnable) {
         const err = responseObject(false, true, {
            message: 'Account is not enable',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(err);
      }

      if (!account?.roleId) {
         const err = responseObject(false, true, {
            message: 'Account has no role',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(err);
      }

      if (!account?.password) {
         const err = responseObject(false, true, {
            message: 'Account has no password',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(err);
      }

      // check if the password is correct
      const isMatch = await bcrypt.compare(password, account.password);

      if (!isMatch) {
         const error = responseObject(false, true, {
            message: 'Account password is incorrect',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(error);
      }

      if (isMatch) {
         const userRoleInfo = await this.authModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(account?._id) } },
            {
               $lookup: {
                  from: 'roles',
                  localField: 'roleId',
                  foreignField: '_id',
                  as: 'role',
                  pipeline: [{ $project: { roleName: 1 } }],
               },
            },
            { $unwind: { path: '$role', preserveNullAndEmptyArrays: true } },
            { $project: { role: { roleName: 1 } } },
         ]);

         const userRole = userRoleInfo?.[0];
         const { roleName } = userRole?.role;

         if (roleName === 'admin' || roleName === 'subAdmin') {
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
                  userRole: { roleName: roleName },
               },
            });

            return res.status(HttpStatus.CREATED).json(response);
         }

         const err = responseObject(false, true, {
            message: 'Account has not valid roles to login',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(err);
      }
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

      const userId = new mongoose.Types.ObjectId();

      const newAccount = await new this.authModel({
         _id: userId,
         email,
         password: hashedPassword,
      }).save();

      if (!newAccount) {
         const error = responseObject(false, true, {
            message: 'Something went wrong',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(error);
      }

      // create user account config also.
      const accountConfig = await new this.accountConfigModel({
         userId: userId,
         clientId: uuidv4(),
      }).save();

      if (!accountConfig) {
         const error = responseObject(false, true, {
            message: 'Something went wrong with account config',
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
