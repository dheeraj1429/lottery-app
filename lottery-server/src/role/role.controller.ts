import {
   Body,
   Controller,
   Delete,
   Get,
   Patch,
   Post,
   Query,
   Req,
   Res,
   UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { RolesDto, UpdateRoleDto, UserGetRoleDto } from './dtos/roles.dto';

@UseGuards(JwtGuard)
@Controller('roles')
export class RoleController {
   constructor(private readonly roleService: RoleService) {}

   @Post('/create-new-roles')
   async createNewRoles(@Body() body: RolesDto, @Req() req, @Res() res) {
      return this.roleService.createNewRole(body, req, res);
   }

   @Get('/get-all-roles')
   async getAllRoles(@Res() res) {
      return this.roleService.getAllRoles(res);
   }

   @Get('/get-roles-with-id')
   async getRoleWithId(@Query() query, @Res() res) {
      return this.roleService.getRolesWithId(query, res);
   }

   @Get('/get-single-role')
   async getSingleRole(@Req() req, @Res() res) {
      return this.roleService.getSingleRole(req, res);
   }

   @Get('/get-user-role')
   async getUserRole(@Query() query: UserGetRoleDto, @Res() res) {
      return this.roleService.getUseRoles(query, res);
   }

   @Patch('/update-single-role')
   async updateRole(@Body() body: UpdateRoleDto, @Res() res) {
      return this.roleService.updateRole(body, res);
   }

   @Delete('/delete-single-role')
   async deleteRole(@Req() req, @Res() res) {
      return this.roleService.deleteSingleRole(req, res);
   }
}
