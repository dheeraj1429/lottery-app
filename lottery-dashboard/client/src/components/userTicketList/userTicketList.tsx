import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { singleLotterySelector } from './userTicketList.selector';
import { useSelector } from 'react-redux';
import classes from './userTicketList.module.css';
import LotteryTicketBalls from '../lotteryTicketBalls/lotteryTicketBalls';
import { LotteryListInterface } from '@/redux/features/luckyDraw';

interface lotteryNumbers {
   [index: number | string]: number;
}
interface StateProps {
   lotteryNumbers: lotteryNumbers;
   matches: number[];
}

function UserTicketList({
   lotteryNumbers,
   isUsed,
   numberOfTickets,
   price,
   refundTicket,
   createdAt,
   _id,
}: LotteryListInterface) {
   const { setValue, control, getValues } = useForm<StateProps>({
      defaultValues: {
         lotteryNumbers: {},
         matches: [],
      },
   });

   const singleLottery = useSelector(singleLotterySelector);

   useEffect(() => {
      const { luckyNumbers, jackpotBallNumber } = lotteryNumbers;

      const luckyNumbersObject: lotteryNumbers = {};

      for (let i = 0; i < luckyNumbers.length; i++) {
         luckyNumbersObject[i + 1] = luckyNumbers[i];
      }

      if (!!jackpotBallNumber) {
         luckyNumbersObject['6'] = jackpotBallNumber;
      }

      setValue('lotteryNumbers', luckyNumbersObject);
      const lotteryPollResult = singleLottery?.item?.lotteryResult;

      if (
         !!lotteryPollResult &&
         lotteryPollResult?.luckyNumbers &&
         !!luckyNumbers &&
         luckyNumbers?.length
      ) {
         const matchesAr = [];

         for (let i = 0; i < luckyNumbers.length; i++) {
            const indexOf = lotteryPollResult?.luckyNumbers.indexOf(
               luckyNumbers[i],
            );

            if (indexOf >= 0) {
               matchesAr.push(luckyNumbers[i]);
            }
         }

         if (jackpotBallNumber === lotteryPollResult?.jackpotBallNumber) {
            matchesAr.push(lotteryPollResult?.jackpotBallNumber);
         }

         setValue('matches', matchesAr);
      }
   }, []);

   return (
      <tr>
         {/* <td>
            <div className={`${classes['user_div']} shadow`}>
               <img src={user?.avatar} alt="" />
            </div>
         </td>
         <td>
            <p className="font-semibold">{user?.name}</p>
         </td> */}
         <td>
            <div className="flex items-center space-x-2">
               <Controller
                  name="lotteryNumbers"
                  control={control}
                  render={({ field: { value } }) => (
                     <div className="flex items-center text-gray-900">
                        <LotteryTicketBalls
                           show={getValues('matches')}
                           numbers={value}
                           uniqueKey={_id}
                        />
                     </div>
                  )}
               />
               {!!refundTicket ? (
                  <div className={classes['ic']}>
                     <img src="/images/refund-ticket.svg" alt="" />
                  </div>
               ) : null}
            </div>
         </td>
         <td>
            <p className="ont-semibold">x{numberOfTickets}</p>
         </td>
         <td>
            <p>{price}</p>
         </td>
         <td>
            <p>{isUsed ? 'Yes' : 'No'}</p>
         </td>
         <td>
            <p>{refundTicket ? 'Yes' : 'No'}</p>
         </td>
         <td>{dayjs(createdAt).format('MMMM DD YYYY h:m:s A')}</td>
      </tr>
   );
}

export default UserTicketList;
