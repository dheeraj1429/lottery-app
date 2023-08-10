import { createSelector } from '@reduxjs/toolkit';
import { AppState } from '@/redux/store/store';

const clientReducer = (state: AppState) => state.client;

export const selectedTabSelector = createSelector(
   [clientReducer],
   (clientSlice) => clientSlice.selectedTab,
);
