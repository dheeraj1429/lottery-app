'use client';

import React, { useState } from 'react';
import classes from './lotteryTabs.module.css';
import {
   TabContainer,
   TabsContent,
   TabsList,
   TabsTrigger,
} from '../common/tabs/tabs';
import NoData from '../common/noData/noData';

const buttonsAr = [
   { name: 'My Ticket' },
   { name: 'Result' },
   { name: 'My Winnings' },
];

function LotteryTabs() {
   const [ShowTab, setShowTab] = useState('result');

   const showTabHandler = function (type: string) {
      setShowTab(type);
   };

   return (
      <div className={classes['main_div']}>
         <TabContainer>
            <TabsList>
               {buttonsAr.map((el) => (
                  <TabsTrigger
                     active={
                        ShowTab === el?.name.toLowerCase().replace(' ', '_')
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
               <NoData />
            </TabsContent>
         </TabContainer>
      </div>
   );
}

export default LotteryTabs;
