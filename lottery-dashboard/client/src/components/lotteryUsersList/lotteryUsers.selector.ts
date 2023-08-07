import { AppState } from '@/redux/store/store';
import { createSelector } from '@reduxjs/toolkit';

const luckDrawReducer = (state: AppState) => state.luckyDraw;

export const singleLotteryUsersSelector = createSelector(
   [luckDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.singleLotteryUsers,
);

export const singleLotteryUsersLoadingSelector = createSelector(
   [luckDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.singleLotteryUsersLoading,
);

export const singleLotteryUsersErrorSelector = createSelector(
   [luckDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.singleLotteryUsersError,
);
