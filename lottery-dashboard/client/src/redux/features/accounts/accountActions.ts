import { createAsyncThunk } from '@reduxjs/toolkit';
import {
   CreateNewAccountInterface,
   CreateNewAccountResponseInterface,
   GetAllAccountInterface,
   GetAllAccountsParamInterface,
   GetSingleAccountResponse,
   GetSingleProps,
   UpdateAccountInterface,
   updateAccountPasswordInterface,
} from '.';
import { axiosInstance } from '@/services/axiosInstance';
import { ErrorResponseType, ErrorType } from '@/types/interface';

export const getAllUsersAccounts = createAsyncThunk<
   GetAllAccountInterface,
   GetAllAccountsParamInterface,
   { rejectValue: ErrorType }
>(
   'accounts/getAllUsersAccounts',
   async (
      { userId, page }: GetAllAccountsParamInterface,
      { rejectWithValue },
   ) => {
      try {
         const response = await axiosInstance.get(
            `/accounts/all-account?userId=${userId}&page=${page}`,
         );
         return response.data;
      } catch (err) {
         const error: ErrorResponseType = err as any;
         if (!error?.response) {
            throw err;
         }
         return rejectWithValue(error?.response?.data);
      }
   },
);

export const createNewAccount = createAsyncThunk<
   CreateNewAccountResponseInterface,
   CreateNewAccountInterface,
   { rejectValue: ErrorType }
>(
   'accounts/createNewAccount',
   async (data: CreateNewAccountInterface, { rejectWithValue }) => {
      try {
         const response = await axiosInstance.post(
            '/accounts/create-new-account',
            data,
         );
         return response.data;
      } catch (err) {
         const error: ErrorResponseType = err as any;
         if (!error?.response) {
            throw err;
         }
         return rejectWithValue(error?.response?.data);
      }
   },
);

export const getSelectedAccount = createAsyncThunk<
   GetSingleAccountResponse,
   GetSingleProps,
   { rejectValue: ErrorType }
>(
   'accounts/getSelectedAccount',
   async ({ userId }: { userId: string }, { rejectWithValue }) => {
      try {
         const response = await axiosInstance.get(
            `/accounts/get-single-account-info?userId=${userId}`,
         );
         return response.data;
      } catch (err) {
         const error: ErrorResponseType = err as any;
         if (!error?.response) {
            throw err;
         }
         return rejectWithValue(error?.response?.data);
      }
   },
);

export const updateAccount = createAsyncThunk<
   CreateNewAccountResponseInterface,
   UpdateAccountInterface,
   { rejectValue: ErrorType }
>(
   'accounts/updateAccount',
   async (data: UpdateAccountInterface, { rejectWithValue }) => {
      try {
         const response = await axiosInstance.patch(
            '/accounts/update-user-account',
            data,
         );
         return response.data;
      } catch (err) {
         const error: ErrorResponseType = err as any;
         if (!error?.response) {
            throw err;
         }
         return rejectWithValue(error?.response?.data);
      }
   },
);

export const updateAccountPassword = createAsyncThunk<
   CreateNewAccountResponseInterface,
   updateAccountPasswordInterface,
   { rejectValue: ErrorType }
>(
   'accounts/updateAccountPassword',
   async (data: updateAccountPasswordInterface, { rejectWithValue }) => {
      try {
         const response = await axiosInstance.patch(
            '/accounts/update-account-password',
            data,
         );
         return response.data;
      } catch (err) {
         const error: ErrorResponseType = err as any;
         if (!error?.response) {
            throw err;
         }
         return rejectWithValue(error?.response?.data);
      }
   },
);
