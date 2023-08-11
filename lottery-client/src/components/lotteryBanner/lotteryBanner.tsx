'use client';

import React, { useRef, useEffect } from 'react';
import classes from './lotteryBanner.module.css';
import LotteryBannerButton from '../lotteryBannerButton/lotteryBannerButton';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import {
   getLotteryResult,
   getTodayLottery,
} from '@/redux/features/luckyDraw/luckyDrawActions';
import {
   todayLotterySelector,
   todayLotteryLoadingSelector,
   todayLotteryErrorSelector,
} from './lotteryBanner.selector';
import Error from '../common/error/error';
import { setSelectedTab } from '@/redux/features/client/userSlice';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const settings = {
   dots: false,
   infinite: true,
   arrows: false,
   speed: 500,
   slidesToShow: 1,
   slidesToScroll: 1,
   autoplay: true,
   autoplaySpeed: 2000,
};

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
         dispatch(getTodayLottery());
         dispatch(getLotteryResult());
         dispatch(setSelectedTab('result'));
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
            updateCountdown(todayLottery?.item?.lotteryResultTime);
         }, 1000);
      }

      return () => clearInterval(interval);
   }, [todayLottery]);

   useEffect(() => {
      dispatch(getTodayLottery());
   }, []);

   return (
      <div>
         <div className={classes['bg_slider_main']}>
            <div className={classes['main_slider_div']}>
               <div className={classes['timer_div']}>
                  {!!todayLottery &&
                     todayLottery?.success &&
                     todayLottery?.item && (
                        <h5
                           ref={timerRef}
                           className="text-lg md:text-2xl text-gray-700 font-bold tracking-tighter text-center"
                        ></h5>
                     )}
                  {!!todayLotteryLoading && <CircularProgress size={'30px'} />}
                  {!!todayLotteryError && todayLotteryError?.message && (
                     <Error data={todayLotteryError?.message} />
                  )}
                  <div className={`${classes['center_div']} text-center`}></div>
                  <LotteryBannerButton />
               </div>
               <Slider {...settings}>
                  <div className={classes['banner_slider_div']}>
                     <img src="/images/1.jpg" alt="lottery-banner" />
                  </div>
                  <div className={classes['banner_slider_div']}>
                     <img src="/images/2.jpg" alt="lottery-banner" />
                  </div>
                  <div className={classes['banner_slider_div']}>
                     <img src="/images/3.jpg" alt="lottery-banner" />
                  </div>
               </Slider>
            </div>
         </div>
      </div>
   );
}

export default LotteryBanner;
