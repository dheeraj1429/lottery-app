import { createAsyncThunk } from '@reduxjs/toolkit';
import {
   CreateNewRolePayload,
   CreateNewRolesResponseInterface,
   GetRolesInterface,
   GetSingleRoleInterface,
   SingleRoleApiPayload,
   UpdateSingleRole,
} from '.';
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

export const getAllRoles = createAsyncThunk<
   GetRolesInterface,
   void,
   { rejectValue: KnownError }
>('roles/getAllRoles', async (_, { rejectWithValue }) => {
   try {
      const response = await axiosInstance.get('/roles/get-all-roles');
      return response.data;
   } catch (err) {
      const error: ErrorResponseType = err as any;
      if (!error?.response) {
         throw err;
      }
      return rejectWithValue(error?.response?.data);
   }
});

export const getSingleRole = createAsyncThunk<
   GetSingleRoleInterface,
   SingleRoleApiPayload,
   { rejectValue: KnownError }
>(
   'roles/getSingleRole',
   async ({ roleId }: { roleId: string }, { rejectWithValue }) => {
      try {
         const response = await axiosInstance.get(
            `/roles/get-single-role?roleId=${roleId}`,
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

export const updateRole = createAsyncThunk<
   CreateNewRolesResponseInterface,
   UpdateSingleRole,
   { rejectValue: KnownError }
>('roles/updateRole', async (data: UpdateSingleRole, { rejectWithValue }) => {
   try {
      const response = await axiosInstance.patch(
         '/roles/update-single-role',
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
});
