import { AppState } from '@/redux/store/store';
import { createSelector } from '@reduxjs/toolkit';

const clientReducer = (state: AppState) => state.client;

const luckyDrawReducer = (state: AppState) => state.luckyDraw;

export const userSelector = createSelector(
   [clientReducer],
   (clientSlice) => clientSlice.user,
);

export const myWinningsSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.myWinnings,
);

export const myWinningsLoadingSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.myWinningsLoading,
);

export const myWinningsErrorSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.myWinningsError,
);

export const myWinningsLoadMoreSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.myWinningsLoadMore,
);
