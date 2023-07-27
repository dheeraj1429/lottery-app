import React from 'react';
import classes from './lotteryBanner.module.css';
import Image from 'next/image';
import LotteryBannerButton from '../lotteryBannerButton/lotteryBannerButton';

function LotteryBanner() {
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
                     <h5 className="text-lg md:text-2xl text-gray-100 font-bold tracking-tighter">
                        00:00:00
                     </h5>
                  </div>
               </div>
               <LotteryBannerButton />
            </div>
         </div>
      </div>
   );
}

export default LotteryBanner;
