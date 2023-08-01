import { ApiResponseInterface, ErrorType } from '@/types/interface';
export interface GetTodayLotteryResponse extends ApiResponseInterface {
   item: {
      _id: string;
      gameId: number;
      lotteryPollResultTime: Date;
      createdAt: Date;
   };
}
export interface StateProps {
   todayLottery: GetTodayLotteryResponse | null;
   todayLotteryLoading: boolean;
   todayLotteryError: ErrorType;
}
