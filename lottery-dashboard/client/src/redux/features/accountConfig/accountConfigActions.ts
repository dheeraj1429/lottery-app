import { AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
   AccountConfigPayload,
   AccountConfigResponse,
   UpdateUserAccountConfigPayload,
   updateUserAccountConfigResponse,
} from '.';
import { ErrorResponseType, KnownError } from '@/types/interface';
import { axiosInstance } from '@/services/axiosInstance';

export const getAccountConfig = createAsyncThunk<
   AccountConfigResponse,
   AccountConfigPayload,
   { rejectValue: KnownError }
>(
   'accountConfig/getAccountConfig',
   async ({ userId }: { userId: string }, { rejectWithValue }) => {
      try {
         const response = await axiosInstance.get(
            `/account-config?userId=${userId}`,
         );
         return response.data;
      } catch (err) {
         const error: AxiosError<KnownError> = err as any;
         if (!error?.response) {
            throw err;
         }
         return rejectWithValue(error?.response?.data);
      }
   },
);

export const updateUserAccountConfig = createAsyncThunk<
   updateUserAccountConfigResponse,
   UpdateUserAccountConfigPayload,
   { rejectValue: KnownError }
>(
   'accountConfig/updateUserAccountConfig',
   async (data: UpdateUserAccountConfigPayload, { rejectWithValue }) => {
      try {
         const response = await axiosInstance.patch(
            '/account-config/update-config',
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
