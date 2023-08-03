import {
   Injectable,
   ExecutionContext,
   CanActivate,
   UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class AdminGuard implements CanActivate {
   constructor(
      private readonly jwtTokenService: JwtTokenService,
      private readonly roleService: RoleService,
      private readonly reflector: Reflector,
   ) {}
   async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const authorization = this.jwtTokenService.getToken(request.headers);
      const payload = this.jwtTokenService.getTokenPayload(
         authorization?.token,
      );
      const roles = this.reflector.get<string[]>('roles', context.getHandler());

      if (!roles) return false;
      if (!payload) throw new UnauthorizedException();

      if (payload && payload?.id) {
         const roleInformation = await this.roleService.getUserRoleById(
            payload.id,
         );

         if (!roleInformation) throw new UnauthorizedException();

         const { roleName } = roleInformation?.role;
         const hasRole = roles.some((role) => role === roleName);

         if (!!roleName && hasRole) {
            return true;
         }

         throw new UnauthorizedException();
      }

      return false;
   }
}
