import { createSlice } from '@reduxjs/toolkit';
import { StateProps } from '.';
import {
   getAllLottery,
   getSingleLuckyDraw,
   getUserTicketLuckyNumbersCount,
   updateLuckyDrawResult,
   lotteryUsersJackpotNumbers,
} from './luckyDrawActions';

const INITALSTATE: StateProps = {
   allLottery: null,
   allLotteryLoading: false,
   allLotteryError: null,
   loadMoreLotteryTickets: false,
   singleLottery: null,
   singleLotteryLoading: false,
   singleLotteryError: null,
   lotteryUpdateLoading: false,
   lotteryUpdatedInfo: null,
   lotteryUpdateError: null,
   userLuckyNumbers: null,
   userLuckyNumbersLoading: false,
   userLuckyNumbersError: null,
   userJackpotNumbers: null,
   userJackpotNumbersLoading: false,
   userJackpotNumbersError: null,
};

const luckyDraw = createSlice({
   name: 'luckyDraw',
   initialState: INITALSTATE,
   reducers: {
      removeUpdateLotteryInfo: (state) => {
         state.lotteryUpdatedInfo = null;
         state.lotteryUpdateError = null;
         state.lotteryUpdateLoading = false;
      },
      removeAllLotteryTickets: (state) => {
         state.allLottery = null;
         state.allLotteryLoading = false;
         state.allLotteryError = null;
      },
   },
   extraReducers: (bulder) => {
      bulder
         .addCase(getAllLottery.pending, (state) => {
            // state.allLotteryPoll = null;
            state.allLotteryLoading = true;
            state.allLotteryError = null;
            state.loadMoreLotteryTickets = true;
         })
         .addCase(getAllLottery.rejected, (state, action) => {
            state.allLottery = null;
            state.allLotteryLoading = false;
            state.allLotteryError = action.payload;
            state.loadMoreLotteryTickets = false;
         })
         .addCase(getAllLottery.fulfilled, (state, action) => {
            if (
               state.allLottery?.success &&
               state.allLottery?.items &&
               state.allLottery?.items.length
            ) {
               state.allLottery = {
                  ...state.allLottery,
                  items: [...state.allLottery?.items, ...action.payload?.items],
                  page: state.allLottery?.page + 1,
               };
            } else {
               state.allLottery = action.payload;
            }

            state.loadMoreLotteryTickets = false;
            state.allLotteryLoading = false;
            state.allLotteryError = null;
         });

      bulder
         .addCase(getSingleLuckyDraw.pending, (state) => {
            state.singleLottery = null;
            state.singleLotteryLoading = true;
            state.singleLotteryError = null;
         })
         .addCase(getSingleLuckyDraw.rejected, (state, action) => {
            state.singleLottery = null;
            state.singleLotteryLoading = false;
            state.singleLotteryError = action.payload;
         })
         .addCase(getSingleLuckyDraw.fulfilled, (state, action) => {
            state.singleLottery = action.payload;
            state.singleLotteryLoading = false;
            state.singleLotteryError = null;
         });

      bulder
         .addCase(updateLuckyDrawResult.pending, (state) => {
            state.lotteryUpdatedInfo = null;
            state.lotteryUpdateLoading = true;
            state.lotteryUpdateError = null;
         })
         .addCase(updateLuckyDrawResult.rejected, (state, action) => {
            state.lotteryUpdatedInfo = null;
            state.lotteryUpdateLoading = false;
            state.lotteryUpdateError = action.payload;
         })
         .addCase(updateLuckyDrawResult.fulfilled, (state, action) => {
            state.lotteryUpdatedInfo = action.payload;
            state.lotteryUpdateLoading = false;
            state.lotteryUpdateError = null;
         });

      bulder
         .addCase(getUserTicketLuckyNumbersCount.pending, (state) => {
            state.userLuckyNumbers = null;
            state.userLuckyNumbersLoading = true;
            state.userLuckyNumbersError = null;
         })
         .addCase(getUserTicketLuckyNumbersCount.rejected, (state, action) => {
            state.userLuckyNumbers = null;
            state.userLuckyNumbersLoading = false;
            state.userLuckyNumbersError = action.payload;
         })
         .addCase(getUserTicketLuckyNumbersCount.fulfilled, (state, action) => {
            state.userLuckyNumbers = action.payload;
            state.userLuckyNumbersLoading = false;
            state.userLuckyNumbersError = null;
         });

      bulder
         .addCase(lotteryUsersJackpotNumbers.pending, (state) => {
            state.userJackpotNumbers = null;
            state.userJackpotNumbersLoading = true;
            state.userJackpotNumbersError = null;
         })
         .addCase(lotteryUsersJackpotNumbers.rejected, (state, action) => {
            state.userJackpotNumbers = null;
            state.userJackpotNumbersLoading = false;
            state.userJackpotNumbersError = action.payload;
         })
         .addCase(lotteryUsersJackpotNumbers.fulfilled, (state, action) => {
            state.userJackpotNumbers = action.payload;
            state.userJackpotNumbersLoading = false;
            state.userJackpotNumbersError = null;
         });
   },
});

export const { removeUpdateLotteryInfo, removeAllLotteryTickets } =
   luckyDraw.actions;

export default luckyDraw;
