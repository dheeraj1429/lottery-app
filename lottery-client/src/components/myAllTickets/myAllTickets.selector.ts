import { AppState } from '@/redux/store/store';
import { createSelector } from '@reduxjs/toolkit';

const clientReducer = (state: AppState) => state.client;

const luckyDrawReducer = (state: AppState) => state.luckyDraw;

export const authSelector = createSelector(
   [clientReducer],
   (clientSlice) => clientSlice?.user,
);

export const myAllLotteryTicketsSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.myAllLotteryTickets,
);

export const myAllLotteryTicketsLoadingSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.myAllLotteryTicketsLoading,
);

export const myAllLotteryTicketsErrorSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.myAllLotteryTicketsError,
);

export const myAllLotteryTicketsLoadMoreSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.myAllLotteryTicketsLoadMore,
);
