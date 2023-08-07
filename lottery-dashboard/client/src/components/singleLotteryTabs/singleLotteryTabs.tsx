'use client';

import React, { useState } from 'react';
import {
   TabContainer,
   TabsContent,
   TabsList,
   TabsTrigger,
} from '../common/tabs/tabs';
import LotteryUsersList from '../lotteryUsersList/lotteryUsersList';

const buttonsAr = [
   { name: 'Participate List', value: 'participate' },
   { name: 'Winners List', value: 'winners' },
];

function SingleLotteryTabs() {
   const [ShowTab, setShowTab] = useState<string>('participate');

   const showTabHandler = function (type: string) {
      setShowTab(type);
   };

   return (
      <TabContainer>
         <TabsList>
            {buttonsAr.map((el) => (
               <TabsTrigger
                  active={ShowTab === el?.value}
                  key={el?.name}
                  onClick={() => showTabHandler(el?.value)}
               >
                  {el?.name}
               </TabsTrigger>
            ))}
         </TabsList>
         <TabsContent className="p-2 mt-2">
            {ShowTab === 'participate' ? (
               <LotteryUsersList filter={ShowTab} />
            ) : null}
            {ShowTab === 'winners' ? (
               <LotteryUsersList filter={ShowTab} />
            ) : null}
         </TabsContent>
      </TabContainer>
   );
}

export default SingleLotteryTabs;
