import { createSelector } from '@reduxjs/toolkit';
import { AppState } from '@/redux/store/store';

const luckyDrawReducer = (state: AppState) => state.luckyDraw;

export const lotteryResultInfoSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.lotteryResultInfo,
);

export const lotteryResultLoadingSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.lotteryResultLoading,
);

export const lotteryResultErrrorSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.lotteryResultErrror,
);
