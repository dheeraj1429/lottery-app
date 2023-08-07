import React from 'react';
import classes from './LotteryTicket.module.css';

interface Props {
   show?: number[];
   numbers?: any;
   isDemo?: boolean;
   uniqueKey?: string;
}

const ballsAr = new Array(6).fill(1);

function LotteryTicketBalls({ show, numbers, isDemo, uniqueKey }: Props) {
   return (
      <div
         className={`${classes['main_div']} space-x-1 md:space-x-2 py-2 px-2 py-sm-2 px-sm-3`}
      >
         {ballsAr.map((_, index) => (
            <div
               key={!!uniqueKey ? index + uniqueKey : index}
               className={`${classes['ball']} ${classes['hide']} ${
                  index === 5
                     ? `_last_ball doc_balls ${isDemo && 'dn_balls'}`
                     : isDemo
                     ? 'dn_balls'
                     : 'doc_balls'
               } ${
                  index === 5 ? classes['jackpo_ball'] : classes['normal_ball']
               } ${
                  !!isDemo && !!show && !show.includes(index + 1)
                     ? classes['hide']
                     : !!show && !show.includes(numbers?.[index + 1])
                     ? classes['hide']
                     : classes['show']
               }`}
            >
               {numbers?.[index + 1]}
            </div>
         ))}
      </div>
   );
}

export default LotteryTicketBalls;
