import { createSelector } from '@reduxjs/toolkit';
import { AppState } from '@/redux/store/store';

const roleReducer = (state: AppState) => state.roles;

export const allRolesSelector = createSelector(
   [roleReducer],
   (roleSlice) => roleSlice.allRoles,
);

export const allRolesLoadingSelector = createSelector(
   [roleReducer],
   (roleSlice) => roleSlice.allRolesLoading,
);

export const allRolesErrorSelector = createSelector(
   [roleReducer],
   (roleSlice) => roleSlice.allRolesError,
);
