import { AppState } from '@/redux/store/store';
import { createSelector } from '@reduxjs/toolkit';

const clientReducer = (state: AppState) => state.client;

export const userSelector = createSelector(
   [clientReducer],
   (clientSlice) => clientSlice.user,
);
