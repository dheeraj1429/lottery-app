import { IsNotEmpty, IsString } from 'class-validator';

export class AccountConfigDto {
   @IsNotEmpty()
   @IsString()
   userId: string;
}

export class AccountConfigUpdateDto {
   @IsNotEmpty()
   @IsString()
   userId: string;

   @IsString()
   @IsNotEmpty()
   userInfoApi: string;

   @IsString()
   @IsNotEmpty()
   clientId: string;
}
