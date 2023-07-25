import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schemas/role.schema';
import { RolesDto, UpdateRoleDto, UserGetRoleDto } from './dtos/roles.dto';
import mongoose, { Model } from 'mongoose';
import { Request, Response } from 'express';
import { checkIsValidId, responseObject } from 'src/utils/helper';
import { Auth } from 'src/auth/schemas/auth.schema';

@Injectable()
export class RoleService {
   constructor(
      @InjectModel(Role.name) private readonly roleModel: Model<Role>,
      @InjectModel(Auth.name) private readonly authModel: Model<Auth>,
   ) {}

   async createNewRole(body: RolesDto, req: Request, res: Response) {
      const { roleName, isDefault } = body;

      // check the user role already exists or not.
      const isRoleExists = await this.roleModel.findOne(
         { roleName },
         { roleName: 1 },
      );
      if (isRoleExists) {
         const response = responseObject(false, true, {
            message: 'Role already exists',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(response);
      }
      const createNewRole = await new this.roleModel({
         roleName,
         isDefault,
      }).save();

      if (createNewRole) {
         const response = responseObject(true, false, {
            message: 'Role created',
         });
         return res.status(HttpStatus.CREATED).json(response);
      }

      const response = responseObject(false, true, {
         message: 'Internal server error',
      });
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
   }

   async getAllRoles(res: Response) {
      const allRoles = await this.roleModel.find({}, { __v: 0 });
      if (allRoles) {
         return res.status(HttpStatus.OK).json({
            items: allRoles,
            success: true,
            error: false,
         });
      }
      const err = responseObject(false, true, { message: 'Roles not found' });
      return res.status(HttpStatus.NOT_FOUND).json(err);
   }

   async getSingleRole(req: Request, res: Response) {
      const { roleId } = req.query;
      const isValidId = checkIsValidId(roleId.toString());
      if (!isValidId) {
         const err = responseObject(false, true, {
            message: 'Roles id is required',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(err);
      }
      // find the role document..
      const findDocById = await this.roleModel.findOne(
         { _id: roleId },
         { __v: 0, createdAt: 0 },
      );

      if (findDocById) {
         return res.status(HttpStatus.OK).json({
            success: true,
            error: false,
            item: findDocById,
         });
      }

      const response = responseObject(false, true, {
         message: 'Role document is not found',
      });
      return res.status(HttpStatus.NOT_FOUND).json(response);
   }

   async updateRole(body: UpdateRoleDto, res: Response) {
      const { roleId, isDefault, roleName } = body;

      const isValidId = checkIsValidId(roleId.toString());
      if (!isValidId) {
         const err = responseObject(false, true, {
            message: 'Roles id is required',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(err);
      }

      // find the role is exists or not.
      const findRole = await this.roleModel.findOne(
         { _id: roleId },
         { roleName: 1 },
      );
      if (findRole) {
         const updateRoleDocument = await this.roleModel.updateOne(
            { _id: new mongoose.Types.ObjectId(roleId) },
            {
               $set: {
                  isDefault,
                  roleName,
               },
            },
         );

         if (updateRoleDocument.modifiedCount) {
            const response = responseObject(true, false, {
               message: 'Role document is Updated',
            });
            return res.status(HttpStatus.OK).json(response);
         } else {
            const response = responseObject(false, true, 'No changes');
            return res.status(HttpStatus.BAD_REQUEST).json(response);
         }
      } else {
         const response = responseObject(false, true, {
            message: 'Role document is not found',
         });
         return res.status(HttpStatus.NOT_FOUND).json(response);
      }
   }

   async deleteSingleRole(req: Request, res: Response) {
      const { roleId } = req.query;
      const isValidId = checkIsValidId(roleId.toString());

      if (!isValidId) {
         const err = responseObject(false, true, {
            message: 'Roles id is required',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(err);
      }

      const findAndDelete = await this.roleModel.deleteOne({ _id: roleId });

      if (findAndDelete.deletedCount) {
         const response = responseObject(true, false, {
            roleId: roleId,
            message: 'Role document deleted',
         });
         return res.status(HttpStatus.OK).json(response);
      }

      const response = responseObject(false, true, {
         message: 'Role document is not found',
      });
      return res.status(HttpStatus.NOT_FOUND).json(response);
   }

   async getRolesWithId(query: UserGetRoleDto, res: Response) {
      const { userId } = query;
      const isValidId = checkIsValidId(userId.toString());
      if (!isValidId) {
         const err = responseObject(false, true, {
            message: 'user id is required',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(err);
      }

      const userAssignRole = await this.getUserRoleById(userId);

      if (!userAssignRole) {
         const err = responseObject(false, true, {
            message: "you don't have role to use this feature.",
         });
         return res.status(HttpStatus.UNAUTHORIZED).json(err);
      }

      const { roleName } = userAssignRole?.role;

      let allRoles = [];

      if (roleName === 'admin') {
         allRoles = await this.roleModel.find(
            { roleName: { $in: ['subAdmin'] } },
            { roleName: 1 },
         );
      } else {
         // only find the some roles
         allRoles = await this.roleModel.find({
            roleName: { $in: ['support', 'client'] },
         });
      }

      if (allRoles) {
         const response = responseObject(true, false, { items: allRoles });
         return res.status(HttpStatus.OK).json(response);
      }

      const err = responseObject(false, true, { message: 'Roles not found' });
      return res.status(HttpStatus.NOT_FOUND).json(err);
   }

   async getUseRoles(query: UserGetRoleDto, res: Response) {
      const { userId } = query;
      const isValidId = checkIsValidId(userId.toString());

      if (!isValidId) {
         const err = responseObject(false, true, {
            message: 'User id is required',
         });
         return res.status(HttpStatus.BAD_REQUEST).json(err);
      }

      const userRole = await this.getUserRoleById(userId);

      if (userRole) {
         const response = responseObject(true, false, userRole?.role);
         return res.status(HttpStatus.OK).json(response);
      } else {
         const err = responseObject(false, true, {
            message: 'User have no role',
         });
         return res.status(HttpStatus.UNAUTHORIZED).json(err);
      }
   }

   async getUserRoleById(
      userId: string,
   ): Promise<{ role: { roleName: string } } | undefined> {
      const userRoleInfo = await this.authModel.aggregate([
         { $match: { _id: new mongoose.Types.ObjectId(userId) } },
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
      return userRole;
   }
}
