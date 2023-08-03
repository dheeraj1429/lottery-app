import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/services/axiosInstance';
import { ErrorResponseType, KnownError } from '@/types/interface';
import { GetAllLotteryResponse } from '.';

export const getAllLottery = createAsyncThunk<
   GetAllLotteryResponse,
   { page: number },
   { rejectValue: KnownError }
>('luckyDraw/getAllLottery', async ({ page }, { rejectWithValue }) => {
   try {
      const response = await axiosInstance.get(
         `/lucky-draw/get-all-lottery-draw?page=${page}`,
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
