'use client';

import React, { useEffect } from 'react';
import classes from './lotteryParticipateUserGraph.module.css';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import {
   getUserTicketLuckyNumbersCount,
   lotteryUsersJackpotNumbers,
} from '@/redux/features/luckyDraw/luckyDrawActions';
import {
   userLuckyNumbersSelector,
   userLuckyNumbersLoadingSelector,
   userLuckyNumbersErrorSelector,
   userJackpotNumbersSelector,
   userJackpotNumbersLoadingSelector,
   userJackpotNumbersErrorSelector,
} from './lotteryPoll.Selector';
import Error from '../common/error/error';
import { CircularProgress } from '@mui/material';
import BarChartComponent from '../BarChartComponent/BarChartComponent';

function LotteryParticipateUserGraph({ gameId }: { gameId: string }) {
   const dispatch = useAppDispatch();

   const userLuckyNumbers = useAppSelector(userLuckyNumbersSelector);
   const userLuckyNumbersLoading = useAppSelector(
      userLuckyNumbersLoadingSelector,
   );
   const userLuckyNumbersError = useAppSelector(userLuckyNumbersErrorSelector);
   const userJackpotNumbersError = useAppSelector(
      userJackpotNumbersErrorSelector,
   );
   const userJackpotNumbersLoading = useAppSelector(
      userJackpotNumbersLoadingSelector,
   );
   const userJackpotNumbers = useAppSelector(userJackpotNumbersSelector);

   useEffect(() => {
      dispatch(getUserTicketLuckyNumbersCount({ gameId }));
      dispatch(lotteryUsersJackpotNumbers({ gameId }));
   }, []);

   return (
      <div className={classes['main_div']}>
         <div className="flex w-full h-full items-center">
            <div className="w-full h-full">
               {!!userLuckyNumbersLoading && (
                  <div className="flex items-center justify-center p-2 w-full">
                     <CircularProgress />
                  </div>
               )}
               {!!userLuckyNumbersError && userLuckyNumbersError && (
                  <Error data={userLuckyNumbersError?.message} />
               )}
               {!!userLuckyNumbers &&
                  userLuckyNumbers?.success &&
                  userLuckyNumbers?.items && (
                     <BarChartComponent
                        data={userLuckyNumbers?.items}
                        label={'User lucky numbers with count'}
                     />
                  )}
            </div>
            <div className="w-full h-full">
               {!!userJackpotNumbersLoading && (
                  <div className="flex items-center justify-center p-2 w-full">
                     <CircularProgress />
                  </div>
               )}
               {!!userJackpotNumbersError &&
                  userJackpotNumbersError?.message && (
                     <Error data={userJackpotNumbersError?.message} />
                  )}
               {!!userJackpotNumbers &&
                  userJackpotNumbers?.success &&
                  userJackpotNumbers?.items && (
                     <BarChartComponent
                        data={userJackpotNumbers?.items}
                        label={'User lucky jackpot numbers with count'}
                     />
                  )}
            </div>
         </div>
      </div>
   );
}

export default LotteryParticipateUserGraph;
