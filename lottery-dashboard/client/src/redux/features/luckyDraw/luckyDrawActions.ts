import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/services/axiosInstance';
import { ErrorResponseType, KnownError } from '@/types/interface';
import {
   GameIdPayload,
   GetAllLotteryResponse,
   GetSingleLuckyDrawResponseInterface,
   TicketLuckyNumbersCountResponse,
   UpdateLotteryResponseInterface,
   UpdateLotteryResultInterface,
} from '.';

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

export const getSingleLuckyDraw = createAsyncThunk<
   GetSingleLuckyDrawResponseInterface,
   GameIdPayload,
   { rejectValue: KnownError }
>('luckyDraw/getSingleLuckyDraw', async ({ gameId }, { rejectWithValue }) => {
   try {
      const response = await axiosInstance.get(
         `/lucky-draw/get-single-lucky-draw?gameId=${gameId}`,
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

export const updateLuckyDrawResult = createAsyncThunk<
   UpdateLotteryResponseInterface,
   UpdateLotteryResultInterface,
   { rejectValue: KnownError }
>('luckyDraw/updateLuckyDrawPollResult', async (data, { rejectWithValue }) => {
   try {
      const response = await axiosInstance.patch(
         '/lucky-draw/update-lucky-draw-result',
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

export const getUserTicketLuckyNumbersCount = createAsyncThunk<
   TicketLuckyNumbersCountResponse,
   GameIdPayload,
   { rejectValue: KnownError }
>(
   'luckyDraw/getUserTicketLuckyNumbersCount',
   async ({ gameId }, { rejectWithValue }) => {
      try {
         const response = await axiosInstance.get(
            `/lucky-draw/get-single-lottery-users-lucky-numbers?gameId=${gameId}`,
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

export const lotteryUsersJackpotNumbers = createAsyncThunk<
   TicketLuckyNumbersCountResponse,
   GameIdPayload,
   { rejectValue: KnownError }
>(
   'luckyDraw/lotteryUsersJackpotNumbers',
   async ({ gameId }, { rejectWithValue }) => {
      try {
         const response = await axiosInstance.get(
            `/lucky-draw/get-lottery-users-jackpot-numbers?gameId=${gameId}`,
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
