import { createSlice } from '@reduxjs/toolkit';
import { getTodayLottery } from './luckyDrawActions';
import { StateProps } from '.';

const INITALSTATE: StateProps = {
   todayLottery: null,
   todayLotteryLoading: false,
   todayLotteryError: null,
};

const luckyDrawSlice = createSlice({
   name: 'luckyDraw',
   initialState: INITALSTATE,
   reducers: {},
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
   },
});

export default luckyDrawSlice;
