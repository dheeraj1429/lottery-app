import { createSlice } from '@reduxjs/toolkit';
import {
   getTodayLottery,
   getUserLotteryTickets,
   buyLotteryTickets,
} from './luckyDrawActions';
import { StateProps } from '.';

const INITALSTATE: StateProps = {
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
};

const luckyDrawSlice = createSlice({
   name: 'luckyDraw',
   initialState: INITALSTATE,
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
   },
});

export const { removeTickets, showAndHideLotteryBuyPopUp } =
   luckyDrawSlice.actions;

export default luckyDrawSlice;
