import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import classes from './lotteryJackpotBalls.module.css';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface StateProps {
   digitsOptionalNumbers: number[];
   jackpotBallNumber: number;
}

interface Props {
   jackpotBallNumber?: number;
   luckyNumbers?: number[];
}

const digitalBalls = new Array(36).fill(1).map((el, idx) => (el = idx + 1));
const jackpotBalls = new Array(10).fill(1).map((el, idx) => (el = idx + 1));

const schema = yup.object({
   digitsOptionalNumbers: yup.array().required(),
   jackpotBallNumber: yup.number().required(),
});

const LotteryJackpotBalls = forwardRef(
   ({ jackpotBallNumber, luckyNumbers }: Props, ref) => {
      const { getValues, setValue, control } = useForm<StateProps>({
         defaultValues: {
            digitsOptionalNumbers: new Array(5),
            jackpotBallNumber: 0,
         },
         resolver: yupResolver(schema),
      });

      const lotterySelectedBallsHandler = function (
         num: number,
         type: 'digitsOptional' | 'jackpotBall',
      ) {
         if (type === 'digitsOptional') {
            const items = getValues('digitsOptionalNumbers');

            if (items.includes(num)) {
               const updatedNumbers = items.filter((el) => el !== num);
               return setValue('digitsOptionalNumbers', updatedNumbers);
            }

            if (items.length <= 4) {
               const data = items.concat(num);
               setValue('digitsOptionalNumbers', data);
            } else {
               toast.error('You can only select 5 number.');
            }
         }

         if (type === 'jackpotBall') {
            setValue('jackpotBallNumber', num);
         }
      };

      useImperativeHandle(ref, () => ({
         getState() {
            return getValues();
         },
      }));

      useEffect(() => {
         if (!!luckyNumbers && luckyNumbers?.length) {
            setValue('digitsOptionalNumbers', luckyNumbers);
         }
         if (!!jackpotBallNumber) {
            setValue('jackpotBallNumber', jackpotBallNumber);
         }
      }, []);

      return (
         <div>
            <div className={`${classes['ballsDiv']} mt-4 mb-4`}>
               <div className="mb-2 px-2">
                  <p className="text-gray-400 text-sm font-medium">
                     5 digits optional
                  </p>
               </div>
               <div className={classes['grid_div']}>
                  {digitalBalls.map((el, idx) => (
                     <div className="p-1" key={el + idx + 'digitsOptional'}>
                        <div className={classes['digital_ball_div']}>
                           <Controller
                              name="digitsOptionalNumbers"
                              control={control}
                              render={({ field: { value } }) => (
                                 <button
                                    className={
                                       value.includes(el)
                                          ? `${classes['active_ball']} ${classes['ball']}`
                                          : classes['ball']
                                    }
                                    onClick={() =>
                                       lotterySelectedBallsHandler(
                                          el,
                                          'digitsOptional',
                                       )
                                    }
                                 >
                                    <p>{el}</p>
                                 </button>
                              )}
                           />
                        </div>
                     </div>
                  ))}
               </div>
               <div className="mt-4 pt-3">
                  <div className="my-2 px-2">
                     <p className="text-gray-400 text-sm font-medium">
                        1 Jackpot Ball
                     </p>
                  </div>
                  <div className={classes['jackpot_balls']}>
                     <Controller
                        name="jackpotBallNumber"
                        control={control}
                        render={({ field: { value } }) => (
                           <>
                              {jackpotBalls.map((el, idx) => (
                                 <div className="p-1" key={el + idx}>
                                    <div
                                       className={classes['digital_ball_div']}
                                    >
                                       <button
                                          className={
                                             el == +value
                                                ? `${classes['jackpot_active_ball']} ${classes['ball']} ${classes['jc']}`
                                                : `${classes['ball']} ${classes['jc']}`
                                          }
                                          onClick={() =>
                                             lotterySelectedBallsHandler(
                                                el,
                                                'jackpotBall',
                                             )
                                          }
                                       >
                                          <p>{el}</p>
                                       </button>
                                    </div>
                                 </div>
                              ))}
                           </>
                        )}
                     />
                  </div>
               </div>
            </div>
            <p className="text-sm text-green-500 px-2">
               Please choose 6 numbers to take part in the MV.GAME Lottery!
            </p>
         </div>
      );
   },
);

LotteryJackpotBalls.displayName = 'LotteryJackpotBalls';

export default LotteryJackpotBalls;
