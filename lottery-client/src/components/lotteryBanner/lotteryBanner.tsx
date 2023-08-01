'use client';

import React, { useRef, useEffect } from 'react';
import classes from './lotteryBanner.module.css';
import Image from 'next/image';
import LotteryBannerButton from '../lotteryBannerButton/lotteryBannerButton';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { getTodayLottery } from '@/redux/features/luckyDraw/luckyDrawActions';
import {
   todayLotterySelector,
   todayLotteryLoadingSelector,
   todayLotteryErrorSelector,
} from './lotteryBanner.selector';
import Error from '../common/error/error';

function LotteryBanner() {
   const timerRef = useRef<HTMLDivElement>(null);
   const dispatch = useAppDispatch();

   const todayLottery = useAppSelector(todayLotterySelector);
   const todayLotteryLoading = useAppSelector(todayLotteryLoadingSelector);
   const todayLotteryError = useAppSelector(todayLotteryErrorSelector);

   function updateCountdown(countdownTime: Date) {
      const currentTime = new Date().getTime();
      const remainingTime = new Date(countdownTime).getTime() - currentTime;

      if (!timerRef?.current) return;

      if (remainingTime <= 0) {
         return (timerRef.current.textContent = 'Lottery poll result show!');
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

   useEffect(() => {
      let interval: any;
      if (!!todayLottery && todayLottery?.success && todayLottery?.item) {
         interval = setInterval(() => {
            updateCountdown(todayLottery?.item?.lotteryPollResultTime);
         }, 1000);
      }

      return () => clearInterval(interval);
   }, [todayLottery]);

   useEffect(() => {
      dispatch(getTodayLottery());
   }, []);

   return (
      <div>
         <div className={classes['lottery-banner']}>
            <Image
               src="https://static.vecteezy.com/system/resources/previews/001/924/174/original/jackpot-casino-podium-golden-coins-banner-vector.jpg"
               alt="lottery-banner"
               width={150}
               height={150}
               className={classes['bg_image']}
            />
            <div className={classes['banner']}>
               <div className={`${classes['center_div']} text-center`}>
                  <div className={classes['timer_div']}>
                     {!!todayLottery &&
                        todayLottery?.success &&
                        todayLottery?.item && (
                           <h5
                              ref={timerRef}
                              className="text-lg md:text-2xl text-gray-100 font-bold tracking-tighter"
                           ></h5>
                        )}
                     {!!todayLotteryLoading && (
                        <CircularProgress size={'30px'} />
                     )}
                     {!!todayLotteryError && todayLotteryError?.message && (
                        <Error data={todayLotteryError?.message} />
                     )}
                  </div>
               </div>
               <LotteryBannerButton />
            </div>
         </div>
      </div>
   );
}

export default LotteryBanner;
