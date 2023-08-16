import { createSlice } from '@reduxjs/toolkit';
import {
   getTodayLottery,
   getUserLotteryTickets,
   buyLotteryTickets,
   getLotteryResult,
   getMyLotteryWinning,
   getMyAllLotteryTickets,
} from './luckyDrawActions';
import { StateProps } from '.';

const INITIALSTATE: StateProps = {
   todayLottery: null,
   todayLotteryLoading: false,
   todayLotteryError: null,
   lotteryTicketInfo: null,
   lotteryTicketLoading: false,
   lotteryTicketError: null,
   loadMoreTickets: false,
   buyLotteryTicketsLoading: false,
   buyLotteryTicketsError: null,
   buyLotteryTicketsInfo: null,
   showLotteryBuyPopUp: false,
   lotteryResultInfo: null,
   lotteryResultLoading: false,
   lotteryResultErrror: null,
   myWinnings: null,
   myWinningsLoading: false,
   myWinningsError: null,
   myWinningsLoadMore: false,
   myAllLotteryTickets: null,
   myAllLotteryTicketsLoading: false,
   myAllLotteryTicketsError: null,
   myAllLotteryTicketsLoadMore: false,
};

const luckyDrawSlice = createSlice({
   name: 'luckyDraw',
   initialState: INITIALSTATE,
   reducers: {
      removeTickets: (state) => {
         state.lotteryTicketInfo = null;
         state.lotteryTicketLoading = false;
         state.lotteryTicketError = null;
         state.loadMoreTickets = false;
      },
      showAndHideLotteryBuyPopUp: (state, action) => {
         state.showLotteryBuyPopUp = action.payload;
      },
      removeMyWinningsLottery: (state) => {
         state.myWinnings = null;
         state.myWinningsError = null;
         state.myWinningsLoading = false;
         state.myWinningsLoadMore = false;
      },
      removeAllMyTickets: (state) => {
         state.myAllLotteryTickets = null;
         state.myAllLotteryTicketsLoading = false;
         state.myAllLotteryTicketsError = null;
         state.myAllLotteryTicketsLoadMore = false;
      },
   },
   extraReducers: (bulder) => {
      bulder
         .addCase(getTodayLottery.pending, (state) => {
            state.todayLottery = null;
            state.todayLotteryLoading = true;
            state.todayLotteryError = null;
         })
         .addCase(getTodayLottery.rejected, (state, action) => {
            state.todayLottery = null;
            state.todayLotteryLoading = false;
            state.todayLotteryError = action.payload;
         })
         .addCase(getTodayLottery.fulfilled, (state, action) => {
            state.todayLottery = action.payload;
            state.todayLotteryLoading = false;
            state.todayLotteryError = null;
         });

      bulder
         .addCase(getUserLotteryTickets.pending, (state) => {
            // state.lotteryTicketInfo = null;
            state.lotteryTicketLoading = true;
            state.lotteryTicketError = null;
            state.loadMoreTickets = true;
         })
         .addCase(getUserLotteryTickets.rejected, (state, action) => {
            state.lotteryTicketInfo = null;
            state.lotteryTicketLoading = false;
            state.lotteryTicketError = action.payload;
            state.loadMoreTickets = false;
         })
         .addCase(getUserLotteryTickets.fulfilled, (state, action) => {
            if (
               state.lotteryTicketInfo &&
               state.lotteryTicketInfo?.item &&
               state.lotteryTicketInfo?.item?.tickets.length
            ) {
               const { tickets } = action.payload?.item;

               state.lotteryTicketInfo = {
                  ...state.lotteryTicketInfo,
                  item: {
                     ...state.lotteryTicketInfo?.item,
                     tickets: [
                        ...state.lotteryTicketInfo?.item?.tickets,
                        ...tickets,
                     ],
                  },
                  page: state.lotteryTicketInfo?.page + 1,
               };
            } else {
               state.lotteryTicketInfo = action.payload;
            }

            state.lotteryTicketLoading = false;
            state.lotteryTicketError = null;
            state.loadMoreTickets = false;
         });

      bulder
         .addCase(buyLotteryTickets.pending, (state) => {
            state.buyLotteryTicketsInfo = null;
            state.buyLotteryTicketsLoading = true;
            state.buyLotteryTicketsError = null;
         })
         .addCase(buyLotteryTickets.rejected, (state, action) => {
            state.buyLotteryTicketsInfo = null;
            state.buyLotteryTicketsLoading = false;
            state.buyLotteryTicketsError = action.payload;
         })
         .addCase(buyLotteryTickets.fulfilled, (state, action) => {
            const data = action.payload;

            if (!!data && data?.success) {
               const { tickets } = data;

               if (!!state.lotteryTicketInfo && !!tickets) {
                  state.lotteryTicketInfo = {
                     ...state.lotteryTicketInfo,
                     item: {
                        ...state.lotteryTicketInfo.item,
                        tickets: [
                           ...tickets,
                           ...state.lotteryTicketInfo?.item.tickets,
                        ],
                     },
                  };
               }

               state.buyLotteryTicketsInfo = action.payload;
               state.buyLotteryTicketsLoading = false;
               state.buyLotteryTicketsError = null;
            }
         });

      bulder
         .addCase(getLotteryResult.pending, (state) => {
            state.lotteryResultInfo = null;
            state.lotteryResultLoading = true;
            state.lotteryResultErrror = null;
         })
         .addCase(getLotteryResult.rejected, (state, action) => {
            state.lotteryResultInfo = null;
            state.lotteryResultLoading = false;
            state.lotteryResultErrror = action.payload;
         })
         .addCase(getLotteryResult.fulfilled, (state, action) => {
            state.lotteryResultInfo = action.payload;
            state.lotteryResultLoading = false;
            state.lotteryResultErrror = null;
         });

      bulder
         .addCase(getMyLotteryWinning.pending, (state) => {
            // state.myWinnings = null;
            state.myWinningsLoading = true;
            state.myWinningsError = null;
            state.myWinningsLoadMore = true;
         })
         .addCase(getMyLotteryWinning.rejected, (state, action) => {
            state.myWinnings = null;
            state.myWinningsLoading = false;
            state.myWinningsError = action.payload;
            state.myWinningsLoadMore = false;
         })
         .addCase(getMyLotteryWinning.fulfilled, (state, action) => {
            if (
               !!state.myWinnings &&
               state.myWinnings?.success &&
               state.myWinnings?.winningData &&
               state.myWinnings?.winningData?.winnings &&
               state.myWinnings?.winningData?.winnings.length
            ) {
               const { winnings } = action.payload?.winningData;
               state.myWinnings = {
                  ...state.myWinnings,
                  winningData: {
                     ...state.myWinnings?.winningData,
                     winnings: [
                        ...state.myWinnings?.winningData?.winnings,
                        ...winnings,
                     ],
                  },
                  page: state.myWinnings?.page + 1,
               };
            } else {
               state.myWinnings = action.payload;
            }

            state.myWinningsLoading = false;
            state.myWinningsError = null;
            state.myWinningsLoadMore = false;
         });

      bulder
         .addCase(getMyAllLotteryTickets.pending, (state) => {
            // state.myAllLotteryTickets = null;
            state.myAllLotteryTicketsLoading = true;
            state.myAllLotteryTicketsError = null;
            state.myAllLotteryTicketsLoadMore = true;
         })
         .addCase(getMyAllLotteryTickets.rejected, (state, action) => {
            state.myAllLotteryTickets = null;
            state.myAllLotteryTicketsLoading = false;
            state.myAllLotteryTicketsError = action.payload;
            state.myAllLotteryTicketsLoadMore = false;
         })
         .addCase(getMyAllLotteryTickets.fulfilled, (state, action) => {
            const { items } = action.payload;

            if (
               items &&
               state.myAllLotteryTickets &&
               state.myAllLotteryTickets?.items &&
               state.myAllLotteryTickets?.items.length
            ) {
               state.myAllLotteryTickets.items =
                  state.myAllLotteryTickets?.items.concat(items);
            } else {
               state.myAllLotteryTickets = action.payload;
            }
            state.myAllLotteryTicketsLoading = false;
            state.myAllLotteryTicketsError = null;
            state.myAllLotteryTicketsLoadMore = false;
         });
   },
});

export const {
   removeTickets,
   showAndHideLotteryBuyPopUp,
   removeMyWinningsLottery,
   removeAllMyTickets,
} = luckyDrawSlice.actions;

export default luckyDrawSlice;
