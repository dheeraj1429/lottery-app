import { ApiResponseInterface, ErrorType, KnownError } from '@/types/interface';
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
export interface GetSingleLuckyDrawResponseInterface
   extends ApiResponseInterface {
   item: LotteryTicketInterface;
}
export interface UpdateLotteryResultInterface {
   optionalNumbers: number[];
   jackpotBall: number;
   gameId: string;
}
export interface UpdateLotteryResponseInterface extends ApiResponseInterface {
   message: string;
}
export interface LotteryNumberItemsInterface {
   count: number;
   name: number;
}
export interface TicketLuckyNumbersCountResponse extends ApiResponseInterface {
   items: LotteryNumberItemsInterface[];
}
export interface GameIdPayload {
   gameId: string;
}
export interface StateProps {
   allLottery: GetAllLotteryResponse | null;
   allLotteryLoading: boolean;
   allLotteryError: ErrorType;
   loadMoreLotteryTickets: boolean;
   singleLottery: GetSingleLuckyDrawResponseInterface | null;
   singleLotteryLoading: boolean;
   singleLotteryError: ErrorType;
   lotteryUpdateLoading: boolean;
   lotteryUpdatedInfo: UpdateLotteryResponseInterface | null;
   lotteryUpdateError: ErrorType;
   userLuckyNumbers: TicketLuckyNumbersCountResponse | null;
   userLuckyNumbersLoading: boolean;
   userLuckyNumbersError: ErrorType;
   userJackpotNumbers: TicketLuckyNumbersCountResponse | null;
   userJackpotNumbersLoading: boolean;
   userJackpotNumbersError: ErrorType;
}
