import {
   ApiResponseInterface,
   ErrorType,
   KnownError,
   PaginationResponse,
} from '@/types/interface';
export interface GetTodayLotteryResponse extends ApiResponseInterface {
   item: {
      _id: string;
      gameId: number;
      lotteryResultTime: Date;
      createdAt: Date;
   };
}
export interface GetUserLotteryTicketsPayload {
   userId: string;
   gameId: string;
   page: number;
}
export interface lotteryNumbers {
   luckyNumbers: number[];
   jackpotBallNumber: number;
}
export interface LotteryTicketsInterface {
   createdAt: Date;
   isUsed: boolean;
   numberOfTickets: number;
   price: string;
   refundTicket: boolean;
   userId: string;
   lotteryNumbers: lotteryNumbers;
   numbersMatches?: number;
   _id: string;
}
export interface GetUserLotteryTicketsResponse extends ApiResponseInterface {
   page: number;
   totalPages: number;
   item: {
      item: {
         totalDocuments: number;
         _id: string;
      };
      tickets: LotteryTicketsInterface[];
   };
}
export interface UserLotteryInterface {
   userId: string;
   numberOfTickets: number;
   lotteryNumbers: lotteryPollNumbers;
}
export interface BuyLotteryTicketsPayload {
   amount: string;
   gameId: number;
   userLotteryData?: UserLotteryInterface[];
   isManually: boolean;
   numberOfTickets?: number;
   userId: string;
   clientId: stirng;
}
export interface BuyLotteryTicketsResponse extends ApiResponseInterface {
   message?: string;
   tickets?: LotteryTicketsInterface[];
}
export interface LotteryNumbersInterface {
   luckyNumbers: number[];
   jackpotBallNumber: number;
   _id: string;
}
export interface GetLotteryResultInterface extends ApiResponseInterface {
   item: {
      _id: string;
      gameId: number;
      lotteryResult: LotteryNumbersInterface;
      lotteryResultShow: boolean;
      createdAt: Date;
   };
}
export interface GetResultLotteryWinnersInterface {
   gameId: string;
   page: number;
}
export interface GetMyLotteryWinningPayload {
   page: number;
   userId: string;
}
export interface GetMyLotteryWinningInterface
   extends ApiResponseInterface,
      PaginationResponse {
   winningData: {
      winnings: LotteryTicketsInterface[];
   };
}
export interface StateProps {
   todayLottery: GetTodayLotteryResponse | null;
   todayLotteryLoading: boolean;
   todayLotteryError: ErrorType;
   lotteryTicketInfo: GetUserLotteryTicketsResponse | null;
   lotteryTicketLoading: boolean;
   lotteryTicketError: ErrorType;
   loadMoreTickets: boolean;
   buyLotteryTicketsLoading: boolean;
   buyLotteryTicketsError: ErrorType;
   buyLotteryTicketsInfo: BuyLotteryTicketsResponse | null;
   showLotteryBuyPopUp: boolean;
   lotteryResultInfo: GetLotteryResultInterface | null;
   lotteryResultLoading: boolean;
   lotteryResultErrror: ErrorType;
   myWinnings: GetMyLotteryWinningInterface | null;
   myWinningsLoading: boolean;
   myWinningsError: ErrorType;
   myWinningsLoadMore: boolean;
}
