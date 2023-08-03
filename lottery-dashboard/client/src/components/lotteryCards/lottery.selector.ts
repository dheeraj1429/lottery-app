import { AppState } from '@/redux/store/store';
import { createSelector } from '@reduxjs/toolkit';

const luckyDrawReducer = (state: AppState) => state.luckyDraw;

export const allLotterySelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.allLottery,
);

export const allLotteryLoadingSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.allLotteryLoading,
);

export const allLotteryErrorSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.allLotteryError,
);

export const loadMoreLotteryTicketsSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.loadMoreLotteryTickets,
);
