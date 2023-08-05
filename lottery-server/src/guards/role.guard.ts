import {
   Injectable,
   ExecutionContext,
   CanActivate,
   UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';
import { RoleService } from 'src/role/role.service';

/**
 * This method is responsible for determining whether the authenticated user
 * has the required roles to access the protected resource.
 * @param context The ExecutionContext object containing information about the current HTTP request.
 * @returns A Promise resolving to a boolean value indicating whether the user has the required roles.
 * @throws UnauthorizedException if the user does not have the required roles or is not authenticated.
 */
@Injectable()
export class RoleGuard implements CanActivate {
   constructor(
      private readonly jwtTokenService: JwtTokenService,
      private readonly roleService: RoleService,
      private readonly reflector: Reflector,
   ) {}
   async canActivate(context: ExecutionContext): Promise<boolean> {
      // Extract the HTTP request from the context
      const request = context.switchToHttp().getRequest();

      // Retrieve the JWT token from the request headers
      const authorization = this.jwtTokenService.getToken(request.headers);

      // Decode the JWT token payload
      const payload = this.jwtTokenService.getTokenPayload(
         authorization?.token,
      );

      // Get the roles assigned to the current route from the decorator metadata
      const roles = this.reflector.get<string[]>('roles', context.getHandler());

      // If there are no roles defined for the route, deny access
      if (!roles) return false;

      // If the user is not authenticated, throw an UnauthorizedException
      if (!payload) throw new UnauthorizedException();

      // Check if the payload contains a user ID
      if (payload && payload?.id) {
         // Fetch the user's role information from the RoleService based on the user ID
         const roleInformation = await this.roleService.getUserRoleById(
            payload.id,
         );

         // If no role information is found for the user, throw an UnauthorizedException
         if (!roleInformation) throw new UnauthorizedException();

         // Extract the role name from the role information
         const { roleName } = roleInformation?.role;

         // Check if the user has any of the required roles
         const hasRole = roles.some((role) => role === roleName);

         // If the user has one of the required roles, grant access
         if (!!roleName && hasRole) {
            return true;
         }

         // If the user does not have the required roles, throw an UnauthorizedException
         throw new UnauthorizedException();
      }

      // If the user ID is missing from the payload, deny access
      return false;
   }
}
