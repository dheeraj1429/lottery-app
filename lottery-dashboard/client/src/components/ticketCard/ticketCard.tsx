'use client';

import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import classes from './ticketCard.module.css';
import EditIcon from '@mui/icons-material/Edit';
import { LotteryTicketInterface } from '@/redux/features/luckyDraw';
import LotteryTicketBalls from '../lotteryTicketBalls/lotteryTicketBalls';

function TicketCard({ data }: { data: LotteryTicketInterface }) {
   const { setValue, control } = useForm<{ lotteryNumbers: {} }>({
      defaultValues: {
         lotteryNumbers: {},
      },
   });

   const router = useRouter();

   const linkHandler = function () {
      router.push(`/lottery/edit/${data?._id}`);
   };

   useEffect(() => {
      if (!!data) {
         const {
            lotteryResult: { luckyNumbers, jackpotBallNumber },
         } = data;
         const luckyNumbersObject: {
            [key: string]: number;
         } = {};

         for (let i = 0; i < luckyNumbers.length; i++)
            luckyNumbersObject[i + 1] = luckyNumbers[i];

         if (!!jackpotBallNumber) luckyNumbersObject['6'] = jackpotBallNumber;

         setValue('lotteryNumbers', luckyNumbersObject);
      }
   }, [data]);

   return (
      <div className="w-full p-2">
         <div className={`${classes['coupon']} `}>
            <div className={classes['edit_div']}>
               <EditIcon className="text-gray-600" onClick={linkHandler} />
            </div>
            <div className={classes['center']}>
               <div>
                  <h2>{data?.gameId}</h2>
                  <h3>Game id</h3>
                  <small>
                     Valid until
                     {dayjs(data?.lotteryResultTime).format(
                        'MMM DD hh:mm:ss A',
                     )}
                  </small>
                  <div>
                     {!!data?.lotteryResultShow ? (
                        <small>Lottery poll is expire</small>
                     ) : (
                        <p>Today lottery poll</p>
                     )}
                  </div>
               </div>
            </div>
         </div>
         <div className="flex items-center justify-center mt-2">
            <Controller
               name="lotteryNumbers"
               control={control}
               render={({ field: { value } }) => (
                  <LotteryTicketBalls
                     show={[1, 2, 3, 4, 5, 6]}
                     numbers={value}
                  />
               )}
            />
         </div>
      </div>
   );
}

export default TicketCard;
