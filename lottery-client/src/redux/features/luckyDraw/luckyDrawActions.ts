import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/services/axiosInstance';
import { KnownError } from '@/types/interface';
import { AxiosError } from 'axios';
import {
   BuyLotteryTicketsPayload,
   GetTodayLotteryResponse,
   GetUserLotteryTicketsPayload,
} from '.';

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

export const getUserLotteryTickets = createAsyncThunk<
   any,
   GetUserLotteryTicketsPayload,
   { rejectValue: KnownError }
>(
   'luckyDraw/getUserLotteryTickets',
   async ({ userId, gameId, page }, { rejectWithValue }) => {
      try {
         const response = await axiosInstance.get(
            `/lucky-draw/get-user-lottery-tickets?userId=${userId}&gameId=${gameId}&page=${page}`,
         );
         return response;
      } catch (err) {
         const error: AxiosError<KnownError> = err as any;
         if (!error?.response) {
            throw err;
         }
         return rejectWithValue(error?.response?.data);
      }
   },
);

export const buyLotteryTickets = createAsyncThunk<
   any,
   BuyLotteryTicketsPayload,
   { rejectValue: KnownError }
>('luckyDraw/buyLotteryTickets', async (data, { rejectWithValue }) => {
   try {
      const response = await axiosInstance.post(
         '/lucky-draw/buy-lottery-tickets',
         data,
      );
      console.log(response.data);
      return response.data;
   } catch (err) {
      const error: AxiosError<KnownError> = err as any;
      if (!error?.response) {
         throw err;
      }
      return rejectWithValue(error?.response?.data);
   }
});
