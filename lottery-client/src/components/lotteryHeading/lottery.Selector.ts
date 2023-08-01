import { createSelector } from '@reduxjs/toolkit';
import { AppState } from '@/redux/store/store';

const luckyDrawReducer = (state: AppState) => state.luckyDraw;

export const todayLotterySelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.todayLottery,
);

export const todayLotteryLoadingSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.todayLotteryLoading,
);

export const todayLotteryErrorSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.todayLotteryError,
);
