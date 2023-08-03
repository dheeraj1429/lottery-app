import { ApiResponseInterface, ErrorType } from '@/types/interface';
export interface PaginationResponse {
   totalDocuments: number;
   totalPages: number;
   page: number;
}
export interface LotteryResultInterface {
   jackpotBallNumber: number;
   _id: string;
   luckyNumbers: number[];
}
export interface LotteryTicketInterface {
   _id: string;
   gameId: number;
   createdAt: Date;
   lotteryResultTime: Date;
   lotteryResultShow: boolean;
   lotteryResult: LotteryResultInterface;
}
export interface GetAllLotteryResponse
   extends ApiResponseInterface,
      PaginationResponse {
   items: LotteryTicketInterface[];
}
export interface StateProps {
   allLottery: GetAllLotteryResponse | null;
   allLotteryLoading: boolean;
   allLotteryError: ErrorType;
   loadMoreLotteryTickets: boolean;
}
