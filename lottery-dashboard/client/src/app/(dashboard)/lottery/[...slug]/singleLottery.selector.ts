import { createSelector } from '@reduxjs/toolkit';
import { AppState } from '@/redux/store/store';

const luckyDrawReducer = (state: AppState) => state.luckyDraw;

export const singleLotterySelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.singleLottery,
);

export const singleLotteryLoadingSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.singleLotteryLoading,
);

export const singleLotteryErrorSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.singleLotteryError,
);

export const lotteryUpdateLoadingSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.lotteryUpdateLoading,
);

export const lotteryUpdateErrorSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.lotteryUpdateError,
);

export const lotteryUpdatedInfoReducer = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.lotteryUpdatedInfo,
);
