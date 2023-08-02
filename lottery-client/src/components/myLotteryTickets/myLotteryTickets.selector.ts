import { createSelector } from '@reduxjs/toolkit';
import { AppState } from '@/redux/store/store';

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

export const todayLotteryLoadingSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.todayLotteryLoading,
);

export const todayLotteryErrorSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.todayLotteryError,
);

export const loadMoreTicketsSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.loadMoreTickets,
);

export const lotteryTicketErrorSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.lotteryTicketError,
);

export const lotteryTicketLoadingSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.lotteryTicketLoading,
);

export const lotteryTicketInfoSelector = createSelector(
   [luckyDrawReducer],
   (luckyDrawSlice) => luckyDrawSlice.lotteryTicketInfo,
);
