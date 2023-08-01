import { createSlice } from '@reduxjs/toolkit';
import { AccountState } from '.';
import {
   getAccountConfig,
   updateUserAccountConfig,
} from './accountConfigActions';

const INITALSTATE: AccountState = {
   accountConfigInfo: null,
   accountConfigLoading: false,
   acocuntConfigError: null,
   accountConfigUpdateInfo: null,
   accountConfigUpdateLoading: false,
   accountConfigUpdateError: null,
};

const accountConfigSlice = createSlice({
   name: 'accountConfig',
   initialState: INITALSTATE,
   reducers: {
      removeAccountConfigInfo: (state) => {
         state.accountConfigInfo = null;
         state.accountConfigLoading = false;
         state.acocuntConfigError = null;
         state.accountConfigUpdateInfo = null;
         state.accountConfigUpdateLoading = false;
         state.accountConfigUpdateError = null;
      },
   },
   extraReducers: (bulder) => {
      bulder
         .addCase(getAccountConfig.pending, (state) => {
            state.accountConfigInfo = null;
            state.accountConfigLoading = true;
            state.acocuntConfigError = null;
         })
         .addCase(getAccountConfig.rejected, (state, action) => {
            state.accountConfigInfo = null;
            state.accountConfigLoading = false;
            state.acocuntConfigError = action.payload;
         })
         .addCase(getAccountConfig.fulfilled, (state, action) => {
            state.accountConfigInfo = action.payload;
            state.accountConfigLoading = false;
            state.acocuntConfigError = null;
         });

      bulder
         .addCase(updateUserAccountConfig.pending, (state) => {
            state.accountConfigUpdateInfo = null;
            state.accountConfigUpdateLoading = true;
            state.accountConfigUpdateError = null;
         })
         .addCase(updateUserAccountConfig.rejected, (state, action) => {
            state.accountConfigUpdateInfo = null;
            state.accountConfigUpdateLoading = false;
            state.accountConfigUpdateError = action.payload;
         })
         .addCase(updateUserAccountConfig.fulfilled, (state, action) => {
            state.accountConfigUpdateInfo = action.payload;
            state.accountConfigUpdateLoading = false;
            state.accountConfigUpdateError = null;
         });
   },
});

export const { removeAccountConfigInfo } = accountConfigSlice.actions;

export default accountConfigSlice;
