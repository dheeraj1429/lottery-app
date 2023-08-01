import { ApiResponseInterface, ErrorType } from '@/types/interface';
export interface GetTodayLotteryResponse extends ApiResponseInterface {
   item: {
      _id: string;
      gameId: number;
      lotteryPollResultTime: Date;
      createdAt: Date;
   };
}
export interface GetUserLotteryTicketsPayload {
   userId: string;
   gameId: string;
   page: number;
}
export interface UserLotteryInterface {
   userId: string;
   numberOfTickets: number;
   lotteryPollNumbers: {
      luckyNumbers: number[];
      jackpotBallNumber: number;
   };
}
export interface BuyLotteryTicketsPayload {
   amount: string;
   gameId: number;
   userLotteryData: UserLotteryInterface[];
   isManually: boolean;
   numberOfTickets?: number;
   userId: string;
}
export interface StateProps {
   todayLottery: GetTodayLotteryResponse | null;
   todayLotteryLoading: boolean;
   todayLotteryError: ErrorType;
}
