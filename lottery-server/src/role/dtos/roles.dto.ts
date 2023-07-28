import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class RolesDto {
   @IsString()
   @IsNotEmpty()
   roleName: string;

   @IsNotEmpty()
   @IsBoolean()
   isDefault: boolean;
}

export class UpdateRoleDto extends RolesDto {
   @IsString()
   @IsNotEmpty()
   roleId: string;
}

export class UserGetRoleDto {
   @IsString()
   @IsNotEmpty()
   userId: string;
}
