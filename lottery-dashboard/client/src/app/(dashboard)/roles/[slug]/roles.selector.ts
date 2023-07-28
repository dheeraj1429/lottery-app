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

export const singleRoleSelector = createSelector(
   [roleReducer],
   (roleSlice) => roleSlice.singleRole,
);

export const singleRoleLoadingSelector = createSelector(
   [roleReducer],
   (roleSlice) => roleSlice.singleRoleLoading,
);

export const singleRoleErrorSelector = createSelector(
   [roleReducer],
   (roleSlice) => roleSlice.singleRoleError,
);

export const updateRoleLoadingSelector = createSelector(
   [roleReducer],
   (roleSlice) => roleSlice.updateRoleLoading,
);

export const updateRoleInfoSelector = createSelector(
   [roleReducer],
   (roleSlice) => roleSlice.updateRoleInfo,
);
