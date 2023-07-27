import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AccountDto {
   @IsString()
   @IsNotEmpty()
   userId: string;

   @IsNotEmpty()
   @IsString()
   page: string;
}

export class NewAccountDto {
   @IsEmail()
   @IsNotEmpty()
   email: string;

   @IsNotEmpty()
   @IsBoolean()
   accountEnable: boolean;

   @IsString()
   @IsNotEmpty()
   role: string;

   @IsString()
   @IsNotEmpty()
   userId: string;
}

export class UserAccountGetDto {
   @IsString()
   @IsNotEmpty()
   userId: string;
}

export class UpdateAccountDto {
   @IsString()
   @IsNotEmpty()
   email: string;

   @IsBoolean()
   @IsNotEmpty()
   accountEnable: boolean;

   @IsNotEmpty()
   @IsString()
   role: string;

   @IsString()
   @IsNotEmpty()
   _id: string;
}

export class updateAccountPasswordDto {
   @IsNotEmpty()
   @IsString()
   password: string;

   @IsNotEmpty()
   @IsString()
   userId: string;
}
