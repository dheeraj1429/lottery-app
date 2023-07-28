import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import {
   AccountConfigDto,
   AccountConfigUpdateDto,
} from './dtos/account-config.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AccountConfig } from './schemas/account-config.schema';
import mongoose, { Model } from 'mongoose';
import { responseObject } from 'src/utils/helper';

@Injectable()
export class AccountConfigService {
   constructor(
      @InjectModel(AccountConfig.name)
      private readonly accountConfig: Model<AccountConfig>,
   ) {}

   async getAccountConfig(query: AccountConfigDto, res: Response) {
      const { userId } = query;

      // find user config details
      const userConfigInfo = await this.accountConfig.findOne(
         { userId: new mongoose.Types.ObjectId(userId) },
         { clientId: 1 },
      );

      if (!userConfigInfo) {
         const err = responseObject(false, true, {
            message: 'User config document not found',
         });
         return res.status(HttpStatus.NOT_FOUND).json(err);
      }

      return res.status(HttpStatus.OK).json({
         success: true,
         error: false,
         userConfigInfo,
      });
   }

   async updateUserAccountConfig(query: AccountConfigUpdateDto, res: Response) {
      const { clientId, userId } = query;

      // find the client id or the user id is exists or not.
      const userConfig = await this.accountConfig.findOne({
         $and: [{ userId: new mongoose.Types.ObjectId(userId) }, { clientId }],
      });

      if (!userConfig) {
         const err = responseObject(false, true, {
            message: 'Account config document is not found!',
         });
         return res.status(HttpStatus.NOT_FOUND).json(err);
      }

      const updateAccountConfig = await this.accountConfig.updateOne({
         $and: [{ userId: new mongoose.Types.ObjectId(userId) }, { clientId }],
      });

      if (updateAccountConfig.modifiedCount) {
         const response = responseObject(true, false, {
            message: 'Account config updated',
         });
         return res.status(HttpStatus.OK).json(response);
      }

      const err = responseObject(false, true, { message: 'No changes' });
      return res.status(HttpStatus.BAD_REQUEST).json(err);
   }
}
