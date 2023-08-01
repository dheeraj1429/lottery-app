'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import LotteryHeading from '../lotteryHeading/lotteryHeading';
import {
   userSelector,
   todayLotterySelector,
} from './myLotteryTickets.selector';
import { getUserLotteryTickets } from '@/redux/features/luckyDraw/luckyDrawActions';

function MyLotteryTickets() {
   const dispatch = useAppDispatch();

   const user = useAppSelector(userSelector);
   const todayLottery = useAppSelector(todayLotterySelector);

   useEffect(() => {
      if (
         !!user &&
         user?.user &&
         user?.user?.userId &&
         !!todayLottery &&
         todayLottery?.success &&
         todayLottery?.item?.gameId
      ) {
         dispatch(
            getUserLotteryTickets({
               userId: user?.user?.userId,
               gameId: todayLottery?.item?._id,
               page: 0,
            }),
         );
      }
   }, [todayLottery]);

   return (
      <div>
         <LotteryHeading />
      </div>
   );
}

export default MyLotteryTickets;
