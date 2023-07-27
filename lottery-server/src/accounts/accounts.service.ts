import { HttpStatus, Inject, Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Auth } from 'src/auth/schemas/auth.schema';
import {
   AccountDto,
   NewAccountDto,
   UpdateAccountDto,
   UserAccountGetDto,
   updateAccountPasswordDto,
} from './dtos/accounts.dtos';
import { JwtGuard } from 'src/guards/jwt-guard.guard';
import { checkIsValidId, responseObject } from 'src/utils/helper';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { AccountConfig } from 'src/account-config/schemas/account-config.schema';
import { RoleService } from 'src/role/role.service';

@UseGuards(JwtGuard)
@Injectable()
export class AccountsService {
   constructor(
      @InjectModel(Auth.name) private readonly authModel: Model<Auth>,
      @InjectModel(AccountConfig.name)
      private readonly accountConfigModel: Model<AccountConfig>,
      @Inject(RoleService) private readonly roleService: RoleService,
   ) {}

   async getAllAccount(data: AccountDto, res: Response) {
      const { userId, page } = data;

      const isValidId = checkIsValidId(userId);

      if (!isValidId) {
         const err = responseObject(false, true, {
            message: 'User id is not valid',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(err);
      }

      const documentLimit = 30;

      const totalDocuments = await this.authModel.countDocuments({
         $and: [
            { createdBy: new mongoose.Types.ObjectId(userId) },
            { _id: { $ne: userId } },
         ],
      });

      const findAllUserAccounts = await this.authModel.aggregate([
         {
            $match: {
               $and: [
                  { createdBy: new mongoose.Types.ObjectId(userId) },
                  { _id: { $ne: userId } },
               ],
            },
         },
         {
            $lookup: {
               from: 'accountconfigs',
               localField: '_id',
               foreignField: 'userId',
               as: 'config',
               pipeline: [{ $project: { accountEnable: 1, _id: 0 } }],
            },
         },
         { $unwind: '$config' },
         { $limit: documentLimit },
         { $skip: Number(page) * documentLimit },
         { $sort: { createdAt: -1 } },
         {
            $project: {
               email: 1,
               avatar: 1,
               roleId: 1,
               ownerClientId: 1,
               createdBy: 1,
               createdAt: 1,
               accountEnable: '$config.accountEnable',
            },
         },
      ]);

      if (findAllUserAccounts) {
         const response = responseObject(true, false, {
            items: findAllUserAccounts,
            page: Number(page),
            totalDocuments,
            totalPages: !totalDocuments
               ? 0
               : Math.ceil(totalDocuments / documentLimit - 1),
         });
         return res.status(HttpStatus.OK).json(response);
      }

      const response = responseObject(false, true, {
         message: 'Accounts document is not found',
      });
      return res.status(HttpStatus.NOT_FOUND).json(response);
   }

   async createNewAccount(data: NewAccountDto, res: Response) {
      const { email, role, userId, accountEnable } = data;

      // check the account is already exists or not.
      const isEmailExists = await this.authModel.findOne(
         { email },
         { email: 1 },
      );

      if (isEmailExists) {
         const err = responseObject(false, true, {
            message: 'Email already exists',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(err);
      }

      // get account role.
      const userRoleInfo = await this.roleService.getUserRoleById(userId);
      const { roleName } = userRoleInfo?.role;

      if (!roleName) {
         const err = responseObject(false, true, {
            message: 'You have no access to create account',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(err);
      }

      const clientId = uuidv4();
      const _id = new mongoose.Types.ObjectId();
      let updateConfigObject = {};

      if (roleName === 'admin') {
         updateConfigObject = {
            userId: new mongoose.Types.ObjectId(_id),
            accountEnable,
            clientId,
         };
      } else {
         updateConfigObject = {
            userId: new mongoose.Types.ObjectId(_id),
            accountEnable,
         };
      }

      const createUserConfigDocument = await new this.accountConfigModel(
         updateConfigObject,
      ).save();

      if (!createUserConfigDocument) {
         const err = responseObject(false, true, {
            message: 'Something worng with creating with user config document!',
         });
         return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
      }

      // get owner client id.
      const accountConfig = await this.accountConfigModel.findOne(
         { userId: new mongoose.Types.ObjectId(userId) },
         { clientId: 1 },
      );

      if (!accountConfig) {
         const err = responseObject(false, true, {
            message: 'Account config document is not found!',
         });
         return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
      }

      const createNewDoc = await new this.authModel({
         _id,
         email,
         roleId: new mongoose.Types.ObjectId(role),
         createdBy: new mongoose.Types.ObjectId(userId),
         ownerClientId: accountConfig?.clientId,
      }).save();

      if (createNewDoc) {
         const response = responseObject(true, false, {
            message: 'Account created',
         });
         return res.status(HttpStatus.CREATED).json(response);
      }

      const err = responseObject(false, true, {
         message: 'Internal server error',
      });
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
   }

   async getSingleAccountInfo(query: UserAccountGetDto, res: Response) {
      const { userId } = query;

      const isValidId = checkIsValidId(userId);

      if (!isValidId) {
         const err = responseObject(false, true, {
            message: 'User id is not valid',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(err);
      }

      // find the account from the database.
      const isUserExits = await this.authModel.aggregate([
         { $match: { _id: new mongoose.Types.ObjectId(userId) } },
         {
            $lookup: {
               from: 'accountconfigs',
               localField: '_id',
               foreignField: 'userId',
               as: 'userConfig',
               pipeline: [
                  {
                     $project: {
                        accountEnable: 1,
                     },
                  },
               ],
            },
         },
         { $unwind: '$userConfig' },
         {
            $project: {
               email: 1,
               roleId: 1,
               accountEnable: '$userConfig.accountEnable',
            },
         },
      ]);

      const userData = isUserExits?.[0];

      if (userData) {
         const response = responseObject(true, false, { item: userData });
         return res.status(HttpStatus.OK).json(response);
      } else {
         const err = responseObject(false, true, {
            message: 'Account not found!',
         });
         return res.status(HttpStatus.NOT_FOUND).json(err);
      }
   }

   async updateAccount(data: UpdateAccountDto, res: Response) {
      const { _id, email, accountEnable, role } = data;

      console.log(data);

      const isValidId = checkIsValidId(_id);

      if (!isValidId) {
         const err = responseObject(false, true, {
            message: '_id id is not valid',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(err);
      }

      const updateAccountConfig = await this.accountConfigModel.updateOne(
         { userId: new mongoose.Types.ObjectId(_id) },
         { $set: { accountEnable } },
      );
      const findAndUpdateDoc = await this.authModel.updateOne(
         { _id: new mongoose.Types.ObjectId(_id) },
         { $set: { email, roleId: new mongoose.Types.ObjectId(role) } },
      );

      if (
         findAndUpdateDoc.modifiedCount ||
         updateAccountConfig?.modifiedCount
      ) {
         const response = responseObject(true, false, {
            message: 'Account updated',
         });
         return res.status(HttpStatus.OK).json(response);
      }

      const error = responseObject(false, true, { message: 'No changes' });
      return res.status(HttpStatus.BAD_REQUEST).json(error);
   }

   async updateAccountPassword(body: updateAccountPasswordDto, res: Response) {
      const { userId, password } = body;

      const isValidId = checkIsValidId(userId);

      if (!isValidId) {
         const err = responseObject(false, true, {
            message: 'userId id is not valid',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(err);
      }

      const isAccountExists = await this.authModel.findOne(
         { _id: userId },
         { _id: 1 },
      );

      if (isAccountExists) {
         const hashPassword = await bcrypt.hash(password, 10);
         const updateAccount = await this.authModel.updateOne(
            { _id: userId },
            { $set: { password: hashPassword } },
         );

         if (updateAccount.modifiedCount) {
            const response = responseObject(true, false, {
               message: 'Account password updated',
            });
            return res.status(HttpStatus.OK).json(response);
         }

         const err = responseObject(false, true, {
            message: 'Internal server error',
         });
         return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err);
      } else {
         const err = responseObject(false, true, {
            message: 'Account not found!',
         });
         return res.status(HttpStatus.NOT_FOUND).json(err);
      }
   }
}
