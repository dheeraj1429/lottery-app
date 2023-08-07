import { AppState } from '@/redux/store/store';
import { createSelector } from '@reduxjs/toolkit';

const luckyDrawReducer = (state: AppState) => state.luckyDraw;

export const singleLotterySelector = createSelector(
   [luckyDrawReducer],
   (luckDrawSlice) => luckDrawSlice.singleLottery,
);
