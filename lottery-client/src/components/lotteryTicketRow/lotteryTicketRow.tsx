'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import LotteryTicketBalls from '../lotteryTicketBalls/lotteryTicketBalls';
import {
   LotteryTicketsInterface,
   lotteryNumbers,
} from '@/redux/features/luckyDraw';

interface Props {
   data: LotteryTicketsInterface;
   matchResult?: lotteryNumbers;
   showData?: boolean;
}

function LotteryTicketRow({ data, matchResult, showData }: Props) {
   const { setValue, control, getValues } = useForm({
      defaultValues: { lotteryNumbers: {}, matches: [] },
   });

   useEffect(() => {
      const {
         lotteryNumbers: { luckyNumbers, jackpotBallNumber },
      } = data;

      const luckyNumbersObject: {
         [key: string]: number;
      } = {};

      for (let i = 0; i < luckyNumbers.length; i++) {
         luckyNumbersObject[i + 1] = luckyNumbers[i];
      }

      if (!!jackpotBallNumber) {
         luckyNumbersObject['6'] = jackpotBallNumber;
      }

      setValue('lotteryNumbers', luckyNumbersObject);

      if (
         !!matchResult &&
         matchResult?.luckyNumbers &&
         !!luckyNumbers &&
         luckyNumbers?.length
      ) {
         const matchesAr: any = [];

         for (let i = 0; i < luckyNumbers.length; i++) {
            const indexOf = matchResult?.luckyNumbers.indexOf(luckyNumbers[i]);
            if (indexOf >= 0) {
               matchesAr.push(luckyNumbers[i]);
            }
         }

         if (jackpotBallNumber === matchResult?.jackpotBallNumber) {
            matchesAr.push(matchResult?.jackpotBallNumber);
         }

         setValue('matches', matchesAr);
      }
   }, []);

   return (
      <tr>
         <td>
            <div className={'flex items-center space-x-1 md:space-x-3'}>
               <Controller
                  name="lotteryNumbers"
                  control={control}
                  render={({ field: { value } }) => (
                     <LotteryTicketBalls
                        show={getValues('matches')}
                        numbers={value}
                     />
                  )}
               />
               <div>
                  {!!data?.numbersMatches ? (
                     <div className="flex items-center space-x-1">
                        <p>x{data?.numberOfTickets}</p>
                     </div>
                  ) : null}
               </div>
               {data?.refundTicket && (
                  <div className="w-5 sm:w-7 md:w-10">
                     <img src="/images/refund-ticket.svg" alt="" />
                  </div>
               )}
            </div>
         </td>
         <td className="text-gray-300 text-center">
            {!!data?.numbersMatches ? (
               <p className="text-gray-300 font-medium">
                  {data?.numbersMatches}
               </p>
            ) : (
               <p>x{data?.numberOfTickets}</p>
            )}
         </td>
         <td className={!!showData ? 'text-center' : 'text-end'}>
            <p className="text-gray-300">
               {!!+data?.price ? `$${data?.price}` : '---'}
            </p>
         </td>
         {!!showData && (
            <td className="text-end">
               <p className="text-gray-300">
                  {dayjs(data?.createdAt).format('DD MMM YYYY hh:mm:ss A')}
               </p>
            </td>
         )}
      </tr>
   );
}

export default LotteryTicketRow;
