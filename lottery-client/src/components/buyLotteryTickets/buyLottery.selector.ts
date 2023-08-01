import { AppState } from '@/redux/store/store';
import { createSelector } from '@reduxjs/toolkit';

const clientReducer = (state: AppState) => state.client;

const luckyDrawReducer = (state: AppState) => state.luckyDraw;

export const userSelector = createSelector(
   [clientReducer],
   (clientSlice) => clientSlice.user,
);

export const todayLotterySelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.todayLottery,
);
