import { createSlice } from '@reduxjs/toolkit';
import { StateProps } from '.';
import { getAllLottery } from './luckyDrawActions';

const INITALSTATE: StateProps = {
   allLottery: null,
   allLotteryLoading: false,
   allLotteryError: null,
   loadMoreLotteryTickets: false,
};

const luckyDraw = createSlice({
   name: 'luckyDraw',
   initialState: INITALSTATE,
   reducers: {},
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
   },
});

export default luckyDraw;
