import { createSelector } from '@reduxjs/toolkit';
import { AppState } from '@/redux/store/store';

const clientReducer = (state: AppState) => state.client;

const luckyDrawReducer = (state: AppState) => state.luckyDraw;

export const showSuccessPopUpSelector = createSelector(
   [clientReducer],
   (clientSlice) => clientSlice.showSuccessPopUp,
);

export const showLotteryBuyPopUpSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.showLotteryBuyPopUp,
);
