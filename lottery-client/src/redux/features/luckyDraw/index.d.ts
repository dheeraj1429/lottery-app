import { ApiResponseInterface, ErrorType, KnownError } from '@/types/interface';
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
export interface lotteryPollNumbers {
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
   lotteryPollNumbers: lotteryPollNumbers;
   numbersMatches?: number;
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
   lotteryPollNumbers: lotteryPollNumbers;
}
export interface BuyLotteryTicketsPayload {
   amount: string;
   gameId: number;
   userLotteryData: UserLotteryInterface[];
   isManually: boolean;
   numberOfTickets?: number;
   userId: string;
}
export interface BuyLotteryTicketsResponse extends ApiResponseInterface {
   message?: string;
   tickets?: LotteryTicketsInterface[];
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
}
