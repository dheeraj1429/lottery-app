import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/services/axiosInstance';
import { KnownError } from '@/types/interface';
import { AxiosError } from 'axios';
import { GetTodayLotteryResponse } from '.';

export const getTodayLottery = createAsyncThunk<
   GetTodayLotteryResponse,
   void,
   { rejectValue: KnownError }
>('luckyDraw/getTodayLotteryPoll', async (_, { rejectWithValue }) => {
   try {
      const response = await axiosInstance.get('/lucky-draw/get-today-lottery');
      return response.data;
   } catch (err) {
      const error: AxiosError<KnownError> = err as any;
      if (!error?.response) {
         throw err;
      }
      return rejectWithValue(error?.response?.data);
   }
});
