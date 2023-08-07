import {
   ApiResponseInterface,
   ErrorType,
   KnownError,
   PaginationResponse,
} from '@/types/interface';
export interface LotteryResultInterface {
   jackpotBallNumber: number;
   _id?: string;
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
export interface LotteryListInterface {
   userId: string;
   numberOfTickets: number;
   lotteryNumbers: LotteryResultInterface;
   isUsed: boolean;
   refundTicket: boolean;
   clientId: string;
   _id: string;
   createdAt: Date;
   price: string;
}
export interface GameUserListInterface
   extends ApiResponseInterface,
      PaginationResponse {
   items: {
      lotteryData: LotteryListInterface[];
      lottery: {
         _id: string;
         numberOfDocuments: number;
      };
   };
}
export interface GetGameUserListPayload {
   gameId: string;
   filter: string;
   page: number;
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
   singleLotteryUsers: GameUserListInterface | null;
   singleLotteryUsersLoading: boolean;
   singleLotteryUsersError: ErrorType;
}
