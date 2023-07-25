import { createAsyncThunk } from '@reduxjs/toolkit';
import { CreateNewRolePayload, CreateNewRolesResponseInterface } from '.';
import { ErrorResponseType, KnownError } from '@/types/interface';
import { axiosInstance } from '@/services/axiosInstance';

export const createNewRoleHandler = createAsyncThunk<
   CreateNewRolesResponseInterface,
   CreateNewRolePayload,
   { rejectValue: KnownError }
>(
   'roles/createNewRoleHandler',
   async (data: CreateNewRolePayload, { rejectWithValue }) => {
      try {
         const response =
            await axiosInstance.post<CreateNewRolesResponseInterface>(
               '/roles/create-new-roles',
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
