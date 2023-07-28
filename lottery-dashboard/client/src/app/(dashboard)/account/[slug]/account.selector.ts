import { AppState } from '@/redux/store/store';
import { createSelector } from '@reduxjs/toolkit';

const rolesReducer = (state: AppState) => state.roles;

const accountReducer = (state: AppState) => state.accounts;

export const allRolesWithIdsSelector = createSelector(
   [rolesReducer],
   (rolesSlice) => rolesSlice.allRolesWithIds,
);

export const allRolesWithIdsLoadingSelector = createSelector(
   [rolesReducer],
   (rolesSlice) => rolesSlice.allRolesWithIdsLoading,
);

export const allRolesWithIdsErrorSelector = createSelector(
   [rolesReducer],
   (rolesSlice) => rolesSlice.allRolesWithIdsError,
);

export const createNewAccountInfoSelector = createSelector(
   [accountReducer],
   (accountSlice) => accountSlice.createNewAccountInfo,
);

export const createNewAccountLoadingSelector = createSelector(
   [accountReducer],
   (accountSlice) => accountSlice.createNewAccountLoading,
);

export const createNewAccountErrorSelector = createSelector(
   [accountReducer],
   (accountSlice) => accountSlice.createNewAccountError,
);

export const singleAccountSelector = createSelector(
   [accountReducer],
   (accountSlice) => accountSlice.singleAccount,
);

export const accountUpdateLoadingSelector = createSelector(
   [accountReducer],
   (accountSlice) => accountSlice.accountUpdateLoading,
);
