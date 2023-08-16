import React, { useState, useRef } from 'react';
import SheetPortal, {
   SheetOverlay,
   SheetContent,
} from '../common/portal/portal';
import ModelHeader from '../common/modelHeader/modelHeader';
import classes from './buyLotteryTickets.module.css';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {
   FormControl,
   FormControlLabel,
   Radio,
   RadioGroup,
} from '@mui/material';
import Button from '../common/button/button';
import LotteryJackpotBalls from '../lotteryJackpotBalls/lotteryJackpotBalls';
import { toast } from 'react-hot-toast';
import { useAppSelector, useAppDispatch } from '@/redux/store/hooks';
import {
   userSelector,
   todayLotterySelector,
   buyLotteryTicketsLoadingSelector,
} from './buyLottery.selector';
import { buyLotteryTickets } from '@/redux/features/luckyDraw/luckyDrawActions';
import { BallsRefInterface, StateProps, Props } from '.';
import { useSearchParams } from 'next/navigation';

const priceOfCurrencyToLottery = 1;

function BuyLotteryTickets({ close }: { close?: () => void }) {
   const ballsRef = useRef<BallsRefInterface>();
   const { control, getValues, setValue } = useForm<Props>({
      defaultValues: {
         numberOfTickets: 0,
         totalCost: '0.00000000',
      },
   });
   const [ShowOptions, setShowOptions] = useState<StateProps>({
      isAutomatically: true,
      isManually: false,
   });

   const param = useSearchParams();
   const clientId = param.get('clientId');
   const userInfo = useAppSelector(userSelector);
   const todayLottery = useAppSelector(todayLotterySelector);
   const dispatch = useAppDispatch();
   const buyLotteryTicketsLoading = useAppSelector(
      buyLotteryTicketsLoadingSelector,
   );

   const inputChangeHandler = function (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
   ) {
      const { value } = event.target;
      const valueInInt = +value;
      let updatedCost = priceOfCurrencyToLottery * valueInInt;
      setValue('totalCost', updatedCost.toFixed(6));
   };

   const optionsChangeHandler = function (
      e: React.ChangeEvent<HTMLInputElement>,
   ) {
      const { value } = e.target;
      const updateObject = { ...ShowOptions };
      if (value === 'isAutomatically') {
         updateObject.isAutomatically = true;
         updateObject.isManually = false;
      } else {
         updateObject.isManually = true;
         updateObject.isAutomatically = false;
      }
      setShowOptions(updateObject);
   };

   const submitHandler = function () {
      if (!!userInfo && !!userInfo?.user) {
         const {
            message,
            user: { userId, amountInUsd },
         } = userInfo;
         const gameId = todayLottery?.item?.gameId;

         if (!gameId) {
            return toast.error('Something worng, Please try again latter.');
         }

         if (message !== 'success') {
            return toast.error('interigation is no longer available');
         }

         if (amountInUsd <= 0) {
            return toast.error('you have no money');
         }

         const totalCost = getValues('totalCost');
         const numberOfTickets = +getValues('numberOfTickets');

         if (ShowOptions?.isManually) {
            if (ballsRef?.current) {
               const { digitsOptionalNumbers, jackpotBallNumber } =
                  ballsRef.current.getState();

               if (
                  !!digitsOptionalNumbers &&
                  digitsOptionalNumbers?.length < 5
               ) {
                  return toast.error('Please select 5 digits optional balls');
               }

               if (!jackpotBallNumber) {
                  return toast.error('Jack pot ball is required');
               }

               const userLotteryData = [
                  {
                     userId,
                     numberOfTickets,
                     lotteryNumbers: {
                        luckyNumbers: digitsOptionalNumbers,
                        jackpotBallNumber,
                     },
                  },
               ];

               dispatch(
                  buyLotteryTickets({
                     userId,
                     amount: totalCost,
                     gameId,
                     userLotteryData,
                     isManually: ShowOptions?.isManually,
                     clientId,
                  }),
               );
            } else {
               console.error('Balls ref is not available');
            }
         } else {
            dispatch(
               buyLotteryTickets({
                  userId,
                  amount: totalCost,
                  gameId,
                  numberOfTickets,
                  isManually: ShowOptions?.isManually,
                  clientId,
               }),
            );
         }
      } else {
         toast.error('User information is not available');
      }
   };

   return (
      <SheetPortal>
         <SheetOverlay />
         <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
         >
            <div className={classes['pop_wh']}>
               <SheetContent className="bg-zinc-800 w-full">
                  <ModelHeader back={close} heading={'Buy lottery tickets'} />
                  <div className="mt-2">
                     <div className={classes['content_div']}>
                        <div className="text-center p-2">
                           <p className="font-medium text-sm text-gray-200">
                              You can get more LTC from MVSwap at anytime
                           </p>
                        </div>
                        <div>
                           <Box
                              sx={{
                                 '& > :not(style)': { my: 1, width: '100%' },
                              }}
                           >
                              <Controller
                                 name="numberOfTickets"
                                 control={control}
                                 render={({ field: { onChange, value } }) => (
                                    <TextField
                                       label="Number of tickets"
                                       variant="outlined"
                                       value={value}
                                       onChange={(event) => {
                                          onChange(event);
                                          inputChangeHandler(event);
                                       }}
                                       type="number"
                                       inputProps={{
                                          step: 1,
                                          autoComplete: 'off',
                                          min: 0,
                                       }}
                                       helperText="1 = 1 Ticket"
                                    />
                                 )}
                              />
                           </Box>
                           <div>
                              <FormControl className="px-2 pt-3 pb-1 text-gray-400">
                                 <RadioGroup
                                    row
                                    onChange={optionsChangeHandler}
                                 >
                                    <FormControlLabel
                                       value="isAutomatically"
                                       control={
                                          <Radio
                                             checked={
                                                ShowOptions?.isAutomatically
                                             }
                                          />
                                       }
                                       label="Generate Automatically"
                                    />
                                    <FormControlLabel
                                       value="isManually"
                                       control={
                                          <Radio
                                             checked={ShowOptions?.isManually}
                                          />
                                       }
                                       label="Select Manually"
                                    />
                                 </RadioGroup>
                              </FormControl>
                           </div>
                           {ShowOptions?.isManually && (
                              <LotteryJackpotBalls ref={ballsRef} />
                           )}
                           <div className="flex items-center justify-center p-5">
                              <Controller
                                 name="numberOfTickets"
                                 control={control}
                                 render={({ field: { value } }) => (
                                    <Button
                                       isLoading={buyLotteryTicketsLoading}
                                       onClick={
                                          !!value
                                             ? () => submitHandler()
                                             : undefined
                                       }
                                       variation="wallet_button"
                                       className={
                                          !value
                                             ? 'not_allow hide'
                                             : 'Crypto_btn'
                                       }
                                    >
                                       Buy tickets
                                    </Button>
                                 )}
                              />
                           </div>
                        </div>
                     </div>
                  </div>
               </SheetContent>
            </div>
         </motion.div>
      </SheetPortal>
   );
}

export default BuyLotteryTickets;
