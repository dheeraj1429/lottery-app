import { createSlice } from '@reduxjs/toolkit';
import { StateInterface } from '.';
import {
   getAllUsersAccounts,
   createNewAccount,
   getSelectedAccount,
   updateAccount,
   updateAccountPassword,
} from './accountActions';

const INITALSTATE: StateInterface = {
   allAccounts: null,
   allAccountsLoading: false,
   allAccountsError: null,
   createNewAccountInfo: null,
   createNewAccountLoading: false,
   createNewAccountError: null,
   singleAccount: null,
   singleAccountLoading: false,
   accountUpdateLoading: false,
   updatePasswordInfo: null,
   updatePasswordInfoLoading: false,
   updatePasswordError: null,
};

const accountSlice = createSlice({
   name: 'accounts',
   initialState: INITALSTATE,
   reducers: {
      removeCreateAccountInfo: (state) => {
         state.createNewAccountInfo = null;
         state.createNewAccountLoading = false;
         state.createNewAccountError = null;
         state.singleAccount = null;
         state.singleAccountLoading = false;
      },
      removerAccountPwdInfo: (state) => {
         state.updatePasswordInfo = null;
         state.updatePasswordInfoLoading = false;
         state.updatePasswordError = null;
      },
   },
   extraReducers: (bulder) => {
      bulder
         .addCase(getAllUsersAccounts.pending, (state) => {
            state.allAccounts = null;
            state.allAccountsLoading = true;
            state.allAccountsError = null;
         })
         .addCase(getAllUsersAccounts.rejected, (state, action) => {
            state.allAccounts = null;
            state.allAccountsLoading = false;
            state.allAccountsError = action.payload;
         })
         .addCase(getAllUsersAccounts.fulfilled, (state, action) => {
            state.allAccounts = action.payload;
            state.allAccountsLoading = false;
            state.allAccountsError = null;
         });

      bulder
         .addCase(createNewAccount.pending, (state) => {
            state.createNewAccountInfo = null;
            state.createNewAccountLoading = true;
            state.createNewAccountError = null;
         })
         .addCase(createNewAccount.rejected, (state, action) => {
            state.createNewAccountInfo = null;
            state.createNewAccountLoading = false;
            state.createNewAccountError = action.payload;
         })
         .addCase(createNewAccount.fulfilled, (state, action) => {
            state.createNewAccountInfo = action.payload;
            state.createNewAccountLoading = false;
            state.createNewAccountError = null;
         });

      bulder
         .addCase(getSelectedAccount.pending, (state) => {
            state.singleAccount = null;
            state.singleAccountLoading = true;
            state.createNewAccountError = null;
         })
         .addCase(getSelectedAccount.rejected, (state, action) => {
            state.singleAccount = null;
            state.singleAccountLoading = false;
            state.createNewAccountError = action.payload;
         })
         .addCase(getSelectedAccount.fulfilled, (state, action) => {
            state.singleAccount = action.payload;
            state.singleAccountLoading = false;
            state.createNewAccountError = null;
         });

      bulder
         .addCase(updateAccount.pending, (state) => {
            state.createNewAccountInfo = null;
            state.accountUpdateLoading = true;
            state.createNewAccountError = null;
         })
         .addCase(updateAccount.rejected, (state, action) => {
            state.createNewAccountInfo = null;
            state.accountUpdateLoading = false;
            state.createNewAccountError = action.payload;
         })
         .addCase(updateAccount.fulfilled, (state, action) => {
            state.createNewAccountInfo = action.payload;
            state.accountUpdateLoading = false;
            state.createNewAccountError = null;
         });

      bulder
         .addCase(updateAccountPassword.pending, (state) => {
            state.updatePasswordInfo = null;
            state.updatePasswordInfoLoading = true;
            state.updatePasswordError = null;
         })
         .addCase(updateAccountPassword.rejected, (state, action) => {
            state.updatePasswordInfo = null;
            state.updatePasswordInfoLoading = false;
            state.updatePasswordError = action.payload;
         })
         .addCase(updateAccountPassword.fulfilled, (state, action) => {
            state.updatePasswordInfo = action.payload;
            state.updatePasswordInfoLoading = false;
            state.updatePasswordError = null;
         });
   },
});

export const { removeCreateAccountInfo, removerAccountPwdInfo } = accountSlice.actions;

export default accountSlice;
