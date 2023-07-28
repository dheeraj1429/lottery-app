'use client';

import React from 'react';
import { Row } from './lotteryData';
import classes from './lotteryRules.module.css';

function LotteryRules() {
   return (
      <div className="mt-4">
         <h1 className="text-gray-100 font-semibold text-lg md:text-xl">
            COCO Lottery Rule
         </h1>
         <div className={`${classes['rules_div']} mt-4`}>
            <div className={'table_div'}>
               <table>
                  <thead>
                     <tr>
                        <th className="w-2/12">Matches</th>
                        <th className="text-center tb_div">Numbers</th>
                        <th className="text-end w-2/12">Price</th>
                     </tr>
                  </thead>
                  <tbody>
                     {Row.map((el) => (
                        <tr key={el?.id}>
                           <td>{el?.heading}</td>
                           <td className="flex justify-center ">{el?.balls}</td>
                           <td className="text-end">{el?.price}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
               <div className="p-3">
                  <p className="text-gray-300 font-medium mt-3">
                     Lottery Instructions:
                  </p>
                  <p className="mt-3 mb-4 text-gray-500 text-sm sm_text">
                     A provably fair algorithm is used to draw the lottery
                     prizes. Prizes are drawn at 15:00 UTC+0 every day. You can
                     buy a ticket for $0.1. The sale of tickets stops at 14:55
                     UTC+0 every day. The player chooses six numbers for each
                     ticket, the first five are from 1 to 36, and the last one
                     is from 1 to 10. You can choose numbers manually or
                     automatically. If you have BCL, you can use BCL to redeem
                     Tickets. Each draw produces six numbers. The more numbers
                     you match in the first five numbers, greater prize you will
                     win.
                  </p>
                  <p className="text-gray-300 font-medium">
                     Winning Prize Details:
                  </p>
                  <p className="mt-3 mb-4 text-gray-500 text-sm sm_text">
                     All six numbers matched: $100,000 prize. In case you are
                     not the only winner, you may need to share the prize
                     equally with others. Five numbers matched, and the sixth
                     number is missed: Each ticket gets a $3,000 prize. Four of
                     the first 5 numbers matched: Each ticket gets a $20 prize.
                     Three of the first 5 numbers matched: Each ticket gets a $1
                     prize. If all six numbers are missed, the lottery will be
                     reserved for free, and continue participating in the next
                     day's draw.
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}

export default LotteryRules;
