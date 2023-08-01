import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

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
}
