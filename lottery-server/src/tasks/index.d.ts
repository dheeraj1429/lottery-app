export interface lotteryNumbers {
   luckyNumbers: number[];
   jackpotBallNumber: number;
}
export interface TicketsArrayInterface {
   lotteryNumbers: lotteryNumbers;
   numberOfTickets: number;
   userId: string;
   price?: Decimal128;
   isUsed: boolean;
   refundTicket: boolean;
   matches?: number[];
   jackpotBallNumberMatch?: number;
}