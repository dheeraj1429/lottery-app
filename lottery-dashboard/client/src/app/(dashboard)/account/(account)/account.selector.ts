import { AppState } from '@/redux/store/store';
import { createSelector } from '@reduxjs/toolkit';

const accountsReducer = (state: AppState) => state.accounts;

export const allAccountsSelector = createSelector(
   [accountsReducer],
   (accountSlice) => accountSlice.allAccounts,
);

export const allAccountsLoadingSelector = createSelector(
   [accountsReducer],
   (accountSlice) => accountSlice.allAccountsLoading,
);

export const allAccountsErrorSelector = createSelector(
   [accountsReducer],
   (accountSlice) => accountSlice.allAccountsError,
);
