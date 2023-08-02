'use client';

import React from 'react';
import Button from '../common/button/button';
import { AnimatePresence } from 'framer-motion';
import BuyLotteryTickets from '../buyLotteryTickets/buyLotteryTickets';
import SuccessPopUp from '../successPopUp/successPopUp';
import {
   showSuccessPopUpSelector,
   showLotteryBuyPopUpSelector,
} from './lotteryBanner.Selector';
import { useAppSelector, useAppDispatch } from '@/redux/store/hooks';
import { showAndHideLotteryBuyPopUp } from '@/redux/features/luckyDraw/luckyDrawSlice';

function LotteryBannerButton() {
   const showSuccessPopUp = useAppSelector(showSuccessPopUpSelector);
   const showLotteryBuyPopUp = useAppSelector(showLotteryBuyPopUpSelector);
   const dispatch = useAppDispatch();

   const showAndHideHandler = function () {
      dispatch(showAndHideLotteryBuyPopUp(!showLotteryBuyPopUp));
   };

   return (
      <div className="flex items-center justify-center mt-3">
         <AnimatePresence>
            {showSuccessPopUp && (
               <SuccessPopUp
                  heading="Transaction Successfull"
                  para="Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio
                  quae non facere? Maxime, quia. Cum suscipit quaerat saepe
                  impedit itaque?"
               />
            )}
         </AnimatePresence>
         <AnimatePresence>
            {!!showLotteryBuyPopUp && (
               <BuyLotteryTickets close={showAndHideHandler} />
            )}
         </AnimatePresence>
         <Button variation="tit_btn" onClick={showAndHideHandler}>
            By tickets now
         </Button>
      </div>
   );
}

export default LotteryBannerButton;
