import React from 'react';
import classes from './LotteryTicket.module.css';

interface Props {
   show: number[];
   numbers?: any;
   isDemo: boolean;
}

const ballsAr = new Array(6).fill(1);

function LotteryTicketBalls({ show, numbers, isDemo }: Props) {
   return (
      <div
         className={`${classes['main_div']} space-x-1 md:space-x-2 py-2 px-2 py-sm-2 px-sm-3`}
      >
         {ballsAr.map((_, index) => (
            <div
               key={index}
               className={`${classes['ball']} ${
                  index === 5
                     ? `_last_ball opacity-100 doc_balls ${
                          isDemo && 'dn_balls'
                       }`
                     : isDemo
                     ? 'dn_balls'
                     : 'doc_balls'
               } ${
                  index === 5 ? classes['jackpo_ball'] : classes['normal_ball']
               } ${
                  !!isDemo && !show.includes(index + 1)
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
