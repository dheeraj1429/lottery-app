import { HttpStatus, Injectable } from '@nestjs/common';
import { ClientUtilsDto } from './dots/client-utils.dtos';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from 'src/auth/schemas/auth.schema';
import { Model } from 'mongoose';
import { AccountConfig } from 'src/account-config/schemas/account-config.schema';
import axios from 'axios';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';
import { responseObject, validateObject } from 'src/utils/helper';

@Injectable()
export class ClientUtilsService {
   constructor(
      @InjectModel(Auth.name) private readonly authModel: Model<Auth>,
      @InjectModel(AccountConfig.name)
      private readonly accountConfigModel: Model<AccountConfig>,
      private readonly jwtTokenService: JwtTokenService,
   ) {}

   async integrationClient(data: ClientUtilsDto, res: Response) {
      const { clientId, userId } = data;

      // check the client id is exists or not.
      const findUserConfigDoc = await this.accountConfigModel.findOne({
         clientId,
      });

      if (!findUserConfigDoc) {
         const err = responseObject(false, true, {
            message: 'Account config document is not found!',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(err);
      }

      if (!findUserConfigDoc?.userInfoApi) {
         const err = responseObject(false, true, {
            message: 'Account configuration is not completed yet!',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(err);
      }

      if (findUserConfigDoc) {
         if (!findUserConfigDoc?.accountEnable) {
            const err = responseObject(false, true, {
               message: 'Client account is not enable',
            });
            return res.status(HttpStatus.BAD_REQUEST).json(err);
         }

         // get the information about the user.
         const apiUrl = findUserConfigDoc?.userInfoApi;

         try {
            const body = [userId];

            const userInfo = await axios.post(apiUrl, { data: body });
            const user = userInfo?.data?.users[0];
            const { error } = validateObject(user, [
               'userId',
               'name',
               'avatar',
               'amountInUsd',
            ]);

            if (error) {
               const err = responseObject(false, true, { message: error });
               return res.status(HttpStatus.BAD_REQUEST).json(err);
            }

            if (userInfo) {
               const token = await this.jwtTokenService.genrateAccessToken(
                  { userId },
                  '10d',
                  process.env.ACCESS_TOKEN_SECRET,
               );
               const response = responseObject(true, false, {
                  message: 'success',
                  user,
                  token,
               });
               return res.status(HttpStatus.OK).json(response);
            }
         } catch (err) {
            if (err?.response?.data?.message) {
               return res
                  .status(HttpStatus.BAD_REQUEST)
                  .json(err?.response?.data);
            }
            return res.status(HttpStatus.BAD_REQUEST).json(err);
         }
      }

      const err = responseObject(false, true, {
         message: 'Client id is not exists',
      });
      return res.status(HttpStatus.BAD_REQUEST).json(err);
   }
}
