import { AppState } from '@/redux/store/store';
import { createSelector } from '@reduxjs/toolkit';

const accountConfigReducer = (state: AppState) => state.accountConfig;

export const accountConfigInfoSelector = createSelector(
   [accountConfigReducer],
   (accountConfigSlice) => accountConfigSlice.accountConfigInfo,
);

export const accountConfigLoadingSelector = createSelector(
   [accountConfigReducer],
   (accountConfigSlice) => accountConfigSlice.accountConfigLoading,
);

export const acocuntConfigErrorSelector = createSelector(
   [accountConfigReducer],
   (accountConfigSlice) => accountConfigSlice.acocuntConfigError,
);

export const accountConfigUpdateInfoSelector = createSelector(
   [accountConfigReducer],
   (accountConfigSlice) => accountConfigSlice.accountConfigUpdateInfo,
);

export const accountConfigUpdateLoadingSelector = createSelector(
   [accountConfigReducer],
   (accountConfigSlice) => accountConfigSlice.accountConfigUpdateLoading,
);

export const accountConfigUpdateErrorSelector = createSelector(
   [accountConfigReducer],
   (accountConfigSlice) => accountConfigSlice.accountConfigUpdateError,
);
