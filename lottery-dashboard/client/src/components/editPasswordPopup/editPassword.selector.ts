import { AppState } from '@/redux/store/store';
import { createSelector } from '@reduxjs/toolkit';

const accountReducer = (state: AppState) => state.accounts;

export const updatePasswordInfoSelector = createSelector(
   [accountReducer],
   (accountSlice) => accountSlice.updatePasswordInfo,
);

export const updatePasswordInfoLoadingSelector = createSelector(
   [accountReducer],
   (accountSlice) => accountSlice.updatePasswordInfoLoading,
);

export const updatePasswordErrorSelector = createSelector(
   [accountReducer],
   (accountSlice) => accountSlice.updatePasswordError,
);
