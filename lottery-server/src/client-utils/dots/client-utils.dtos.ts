import { IsNotEmpty, IsString } from 'class-validator';

export class ClientUtilsDto {
   @IsNotEmpty()
   @IsString()
   clientId: string;

   @IsNotEmpty()
   @IsString()
   userId: string;
}
