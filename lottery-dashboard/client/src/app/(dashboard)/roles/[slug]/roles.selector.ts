import { AppState } from '@/redux/store/store';
import { createSelector } from '@reduxjs/toolkit';

const roleReducer = (state: AppState) => state.roles;

export const createNewRoleLoadingSelector = createSelector(
   [roleReducer],
   (roleSlice) => roleSlice.createNewRoleLoading,
);

export const createNewRoleErrorSelector = createSelector(
   [roleReducer],
   (roleSlice) => roleSlice.createNewRoleError,
);
