'use client';

import React, { Fragment, useEffect } from 'react';
import LotteryHeading from '../lotteryHeading/lotteryHeading';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import {
   getLotteryResult,
   // getResultLotteryWinners,
} from '@/redux/features/luckyDraw/luckyDrawActions';
import {
   lotteryResultInfoSelector,
   lotteryResultLoadingSelector,
   lotteryResultErrrorSelector,
} from './lotteryResult.selector';
import Error from '../common/error/error';
import { CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import LotteryTicketBalls from '../lotteryTicketBalls/lotteryTicketBalls';

interface LotteryNumbersInterface {
   [index: string | number]: number;
}
interface StateProps {
   lotteryNumbers: LotteryNumbersInterface;
}

function LotteryResult() {
   const { setValue, control } = useForm<StateProps>({
      defaultValues: {
         lotteryNumbers: {},
      },
   });

   const dispatch = useAppDispatch();

   const lotteryResultErrror = useAppSelector(lotteryResultErrrorSelector);
   const lotteryResultLoading = useAppSelector(lotteryResultLoadingSelector);
   const lotteryResultInfo = useAppSelector(lotteryResultInfoSelector);

   useEffect(() => {
      if (
         !!lotteryResultInfo &&
         lotteryResultInfo?.success &&
         lotteryResultInfo?.item
      ) {
         const { lotteryResult } = lotteryResultInfo?.item;
         const gameId = lotteryResultInfo?.item?._id;

         if (gameId) {
            // dispatch(getResultLotteryWinners({ page: 0, gameId }));
         }

         if (!!lotteryResult) {
            const { luckyNumbers, jackpotBallNumber } = lotteryResult;

            if (!!luckyNumbers && luckyNumbers.length && !!jackpotBallNumber) {
               const luckyNumbersObject: LotteryNumbersInterface = {};

               for (let i = 0; i < luckyNumbers.length; i++) {
                  luckyNumbersObject[i + 1] = luckyNumbers[i];
               }

               if (!!jackpotBallNumber) {
                  luckyNumbersObject['6'] = jackpotBallNumber;
               }

               setValue('lotteryNumbers', luckyNumbersObject);
            }
         }
      }
   }, [lotteryResultInfo]);

   useEffect(() => {
      dispatch(getLotteryResult());
   }, []);

   return (
      <div>
         {!!lotteryResultLoading && <CircularProgress />}
         {!!lotteryResultErrror && lotteryResultErrror?.message && (
            <Error data={lotteryResultErrror?.message} />
         )}
         {!!lotteryResultInfo &&
         lotteryResultInfo?.success &&
         lotteryResultInfo?.item ? (
            <Fragment>
               <LotteryHeading
                  gameId={lotteryResultInfo?.item?.gameId}
                  date={lotteryResultInfo?.item?.lotteryResultTime}
               />
               <div className="flex items-center justify-center py-3">
                  <Controller
                     name="lotteryNumbers"
                     control={control}
                     render={({ field: { value } }) => (
                        <div className="big_draw">
                           <LotteryTicketBalls
                              show={[1, 2, 3, 4, 5, 6]}
                              numbers={value}
                              isDemo={true}
                           />
                        </div>
                     )}
                  />
               </div>
            </Fragment>
         ) : !lotteryResultLoading ? (
            <div className="p-4 flex items-center justify-center">
               <p className="text-gray-400 text-lg font-bold mt-3">
                  No Lottery Poll
               </p>
            </div>
         ) : null}
      </div>
   );
}

export default LotteryResult;
