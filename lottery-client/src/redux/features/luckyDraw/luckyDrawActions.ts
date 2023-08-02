import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/services/axiosInstance';
import { KnownError } from '@/types/interface';
import { AxiosError } from 'axios';
import {
   BuyLotteryTicketsPayload,
   BuyLotteryTicketsResponse,
   GetTodayLotteryResponse,
   GetUserLotteryTicketsPayload,
   GetUserLotteryTicketsResponse,
} from '.';
import { showAndHideSuccessPopUp } from '../client/userSlice';
import { showAndHideLotteryBuyPopUp } from './luckyDrawSlice';

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
   GetUserLotteryTicketsResponse,
   GetUserLotteryTicketsPayload,
   { rejectValue: KnownError }
>(
   'luckyDraw/getUserLotteryTickets',
   async ({ userId, gameId, page }, { rejectWithValue }) => {
      try {
         const response = await axiosInstance.get(
            `/lucky-draw/get-user-lottery-tickets?userId=${userId}&gameId=${gameId}&page=${page}`,
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

export const buyLotteryTickets = createAsyncThunk<
   BuyLotteryTicketsResponse,
   BuyLotteryTicketsPayload,
   { rejectValue: KnownError }
>(
   'luckyDraw/buyLotteryTickets',
   async (data, { rejectWithValue, dispatch }) => {
      try {
         const response = await axiosInstance.post(
            '/lucky-draw/buy-lottery-tickets',
            data,
         );

         if (!!response && response?.data && response?.data?.success) {
            dispatch(showAndHideSuccessPopUp(true));
            dispatch(showAndHideLotteryBuyPopUp(false));
            setTimeout(() => {
               dispatch(showAndHideSuccessPopUp(false));
            }, 3000);
         }

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
