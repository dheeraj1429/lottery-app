'use client';

import React from 'react';
import classes from './lotteryTabs.module.css';
import {
   TabContainer,
   TabsContent,
   TabsList,
   TabsTrigger,
} from '../common/tabs/tabs';
import MyLotteryTickets from '../myLotteryTickets/myLotteryTickets';
import LotteryResult from '../lotteryResult/lotteryResult';
import MyLotteryWinning from '../myLotteryWinning/myLotteryWinning';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { setSelectedTab } from '@/redux/features/client/userSlice';
import { selectedTabSelector } from './lotteryTabs.selector';
import MyAllTickets from '../myAllTickets/myAllTickets';

const buttonsAr = [
   { name: 'My Ticket' },
   { name: 'Result' },
   { name: 'My Winnings' },
   { name: 'All Tickets' },
];

function LotteryTabs() {
   const selectedTab = useAppSelector(selectedTabSelector);
   const dispatch = useAppDispatch();

   const showTabHandler = function (type: string) {
      dispatch(setSelectedTab(type));
   };

   return (
      <div className={classes['main_div']}>
         <TabContainer>
            <TabsList>
               {buttonsAr.map((el) => (
                  <TabsTrigger
                     active={
                        selectedTab === el?.name.toLowerCase().replace(' ', '_')
                     }
                     key={el?.name}
                     onClick={() =>
                        showTabHandler(el?.name.toLowerCase().replace(' ', '_'))
                     }
                  >
                     {el?.name}
                  </TabsTrigger>
               ))}
            </TabsList>
            <TabsContent className="p-2 bg-zinc-800 mt-2">
               {selectedTab === 'my_ticket' && <MyLotteryTickets />}
               {selectedTab === 'result' && <LotteryResult />}
               {selectedTab === 'my_winnings' && <MyLotteryWinning />}
               {selectedTab === 'all_tickets' && <MyAllTickets />}
            </TabsContent>
         </TabContainer>
      </div>
   );
}

export default LotteryTabs;
