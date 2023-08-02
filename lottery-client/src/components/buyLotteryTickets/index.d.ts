export interface Props {
   numberOfTickets: number;
   totalCost: string;
}
export interface BallsRefInterface {
   getState: () => {
      digitsOptionalNumbers: number[];
      jackpotBallNumber: number;
   };
}
export interface StateProps {
   isAutomatically: boolean;
   isManually: boolean;
}
