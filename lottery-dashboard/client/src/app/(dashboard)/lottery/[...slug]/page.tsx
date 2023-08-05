'use client';

import React, { Fragment, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import PageHeading from '@/components/common/pageHeading/PageHeading';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import {
   getSingleLuckyDraw,
   updateLuckyDrawResult,
} from '@/redux/features/luckyDraw/luckyDrawActions';
import {
   singleLotterySelector,
   singleLotteryLoadingSelector,
   singleLotteryErrorSelector,
   lotteryUpdateLoadingSelector,
   lotteryUpdateErrorSelector,
   lotteryUpdatedInfoReducer,
} from './singleLottery.selector';
import Error from '@/components/common/error/error';
import CircularProgress from '@mui/material/CircularProgress';
import dayjs from 'dayjs';
import classes from './singleLottery.module.css';
import LotteryJackpotBalls from '@/components/lotteryJackpotBalls/lotteryJackpotBalls';
import Button from '@/components/common/button/button';
import { toast } from 'react-hot-toast';
import { removeUpdateLotteryInfo } from '@/redux/features/luckyDraw/luckyDrawSlice';
import LotteryParticipateUserGraph from '@/components/lotteryParticipateUserGraph/lotteryParticipateUserGraph';

export interface BallsRefInterface extends HTMLDivElement {
   getState: () => {
      digitsOptionalNumbers: number[];
      jackpotBallNumber: number;
   };
}
export interface PramsInterface {
   [key: string]: string | string[];
}

function LotteryPage() {
   const params: PramsInterface = useParams();
   const gameId = params?.slug[1];
   const dispatch = useAppDispatch();
   const timerRef = useRef<HTMLDivElement>(null);
   const ballsRef = useRef<BallsRefInterface>(null);

   const singleLottery = useAppSelector(singleLotterySelector);
   const singleLotteryLoading = useAppSelector(singleLotteryLoadingSelector);
   const singleLotteryError = useAppSelector(singleLotteryErrorSelector);
   const lotteryUpdateLoading = useAppSelector(lotteryUpdateLoadingSelector);
   const lotteryUpdateError = useAppSelector(lotteryUpdateErrorSelector);
   const lotteryUpdatedInfo = useAppSelector(lotteryUpdatedInfoReducer);

   function updateCountdown(countdownTime: Date) {
      if (!!timerRef && timerRef?.current) {
         const currentTime = new Date().getTime();
         const remainingTime = new Date(countdownTime).getTime() - currentTime;

         if (remainingTime <= 0) {
            return (timerRef.current.textContent = 'Lottery ended');
         }

         let hours = Math.floor(
            (remainingTime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000),
         );
         let minutes = Math.floor(
            (remainingTime % (60 * 60 * 1000)) / (60 * 1000),
         );
         let seconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

         timerRef.current.textContent = `${hours}h : ${minutes}m : ${seconds}s`;
      }
   }

   const submitHandler = function () {
      if (!gameId) return toast.error('Game id is required!');
      if (!ballsRef.current) return console.error('Balls ref is not available');

      const { digitsOptionalNumbers, jackpotBallNumber } =
         ballsRef.current.getState();

      if (!!digitsOptionalNumbers && digitsOptionalNumbers?.length < 5) {
         return toast.error('Please select 5 digits optional balls');
      }

      if (!jackpotBallNumber) {
         return toast.error('Jack pot ball is reuqired');
      }

      dispatch(
         updateLuckyDrawResult({
            optionalNumbers: digitsOptionalNumbers,
            jackpotBall: jackpotBallNumber,
            gameId,
         }),
      );
   };

   useEffect(() => {
      let interval: ReturnType<typeof setInterval>;
      if (!!singleLottery && singleLottery?.success && singleLottery?.item) {
         interval = setInterval(() => {
            updateCountdown(singleLottery?.item?.lotteryResultTime);
         }, 1000);
      }

      return () => clearInterval(interval);
   }, [singleLottery]);

   useEffect(() => {
      dispatch(getSingleLuckyDraw({ gameId }));

      return () => {
         dispatch(removeUpdateLotteryInfo());
      };
   }, []);

   return (
      <div>
         <PageHeading
            heading={'Welcome to dashboard'}
            pageName={'Edit lottery games'}
            para={
               'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as'
            }
         />
         <div className="py-5">
            {!!singleLotteryLoading && (
               <div className="flex items-center justify-center p-2">
                  <CircularProgress />
               </div>
            )}
            {!!singleLotteryError && singleLotteryError?.message && (
               <Error data={singleLotteryError?.message} />
            )}
            {!!singleLottery &&
            singleLottery?.success &&
            singleLottery?.item ? (
               <Fragment>
                  <div className={classes['gal_div']}>
                     <div className={`${classes['box_div']} space-x-2`}>
                        <div className={classes['hd']}>
                           <h5 className="text-gray-800 font-medium">
                              Game Id
                           </h5>
                        </div>
                        <p className="text-gray-600 font-semibold">
                           {singleLottery?.item?.gameId}
                        </p>
                     </div>
                     <div className={`${classes['box_div']} space-x-2`}>
                        <div className={classes['hd']}>
                           <h5 className="text-gray-800 font-medium">
                              Lottery poll result time
                           </h5>
                        </div>
                        <p className="text-gray-600 font-semibold">
                           {dayjs(
                              singleLottery?.item?.lotteryResultTime,
                           ).format('MMM DD hh:mm:ss A')}
                        </p>
                     </div>
                     <div className={`${classes['box_div']} space-x-2`}>
                        <div className={classes['hd']}>
                           <h5 className="text-gray-800 font-medium">
                              Lottery poll result show
                           </h5>
                        </div>
                        <p className="text-gray-600 font-semibold">
                           {singleLottery?.item?.lotteryResultShow
                              ? 'Yes'
                              : 'No'}
                        </p>
                     </div>
                     <div className={`${classes['box_div']} space-x-2`}>
                        <div className={classes['hd']}>
                           <h5 className="text-gray-800 font-medium">
                              Lottery poll created time
                           </h5>
                        </div>
                        <p className="text-gray-600 font-semibold">
                           {dayjs(singleLottery?.item?.createdAt).format(
                              'MMM DD hh:mm:ss A',
                           )}
                        </p>
                     </div>
                     <div className="pt-5 pb-3">
                        <div className={classes['timer_div']}>
                           <p
                              ref={timerRef}
                              className="text-gray-300 font-medium text-xl"
                           ></p>
                        </div>
                     </div>
                  </div>
                  <div>
                     <LotteryParticipateUserGraph gameId={gameId} />
                  </div>
                  <div className="mb-4 mt-4">
                     <div className={classes['lt_div']}>
                        <p className="mb-2 text-gray-500 font-medium">
                           Lucky draw result numbers
                        </p>
                        <LotteryJackpotBalls
                           ref={ballsRef}
                           jackpotBallNumber={
                              singleLottery?.item?.lotteryResult
                                 ?.jackpotBallNumber
                           }
                           luckyNumbers={
                              singleLottery?.item?.lotteryResult?.luckyNumbers
                           }
                        />
                        <div>
                           <div className="mt-4 mb-4 flex items-center justify-center">
                              <Button
                                 onClick={submitHandler}
                                 isLoading={lotteryUpdateLoading}
                                 variation="wallet_button"
                              >
                                 Set lottery result numbers
                              </Button>
                           </div>
                           {!!lotteryUpdateError &&
                              lotteryUpdateError?.message && (
                                 <Error data={lotteryUpdateError?.message} />
                              )}
                           {!!lotteryUpdatedInfo &&
                              lotteryUpdatedInfo?.success && (
                                 <p className="text-gray-400 text-sm">
                                    {lotteryUpdatedInfo?.message}
                                 </p>
                              )}
                        </div>
                     </div>
                  </div>
               </Fragment>
            ) : !singleLotteryLoading ? (
               <p className="text-sm text-gray-800">
                  Lottery poll is not found!
               </p>
            ) : null}
         </div>
      </div>
   );
}

export default LotteryPage;
