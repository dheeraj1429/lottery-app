import {
   IsArray,
   IsBoolean,
   IsInt,
   IsNotEmpty,
   IsString,
} from 'class-validator';

export class getUserLotteryDtos {
   @IsNotEmpty()
   @IsString()
   userId: string;

   @IsNotEmpty()
   @IsString()
   gameId: string;

   @IsNotEmpty()
   @IsString()
   page: string;
}

export class UserLotteryInterface {
   userId: string;
   numberOfTickets: number;
   lotteryPollNumbers: {
      luckyNumbers: number[];
      jackpotBallNumber: number;
   };
}

export class BuyLotteryTicketsDto {
   @IsNotEmpty()
   @IsString()
   amount: string;

   @IsNotEmpty()
   @IsInt()
   gameId: number;

   userLotteryData: UserLotteryInterface[];

   @IsNotEmpty()
   @IsBoolean()
   isManually: boolean;

   numberOfTickets?: number;

   @IsNotEmpty()
   @IsString()
   userId: string;

   @IsNotEmpty()
   @IsString()
   clientId: string;
}

export class GetAllLotteryDrawDto {
   @IsNotEmpty()
   @IsString()
   page: string;
}

export class GetSingleLotteryDrawDto {
   @IsNotEmpty()
   @IsString()
   gameId: string;
}

export class UpdateLotteryResultDto {
   @IsNotEmpty()
   @IsString()
   gameId: string;

   @IsNotEmpty()
   @IsArray()
   optionalNumbers: number[];

   @IsNotEmpty()
   @IsInt()
   jackpotBall: number;
}

export class SingleLuckyDrawUsersListDto {
   @IsNotEmpty()
   @IsString()
   gameId: string;

   @IsNotEmpty()
   @IsString()
   filter: string;

   @IsNotEmpty()
   @IsString()
   page: number;
}

export class GetMyWinningDto {
   @IsNotEmpty()
   @IsString()
   userId: string;

   @IsNotEmpty()
   @IsString()
   page: number;
}
