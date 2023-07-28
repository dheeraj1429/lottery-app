'use client';

import React, { useState } from 'react';
import Button from '../common/button/button';
import { AnimatePresence } from 'framer-motion';
import BuyLotteryTickets from '../buyLotteryTickets/buyLotteryTickets';

function LotteryBannerButton() {
   const [Show, setShow] = useState(false);

   const showAndHideHandler = function () {
      setShow(!Show);
   };

   return (
      <div className="flex items-center justify-center mt-3">
         <AnimatePresence>
            {!!Show && <BuyLotteryTickets close={showAndHideHandler} />}
         </AnimatePresence>
         <Button variation="tit_btn" onClick={showAndHideHandler}>
            By tickets now
         </Button>
      </div>
   );
}

export default LotteryBannerButton;
