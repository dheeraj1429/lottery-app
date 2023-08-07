'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import LotteryHeading from '../lotteryHeading/lotteryHeading';
import {
   userSelector,
   todayLotterySelector,
   loadMoreTicketsSelector,
   lotteryTicketErrorSelector,
   lotteryTicketLoadingSelector,
   lotteryTicketInfoSelector,
} from './myLotteryTickets.selector';
import { getUserLotteryTickets } from '@/redux/features/luckyDraw/luckyDrawActions';
import { removeTickets } from '@/redux/features/luckyDraw/luckyDrawSlice';
import CircularProgress from '@mui/material/CircularProgress';
import Error from '../common/error/error';
import {
   Table,
   TableBody,
   TableContainer,
   TableHeader,
   TableRow,
} from '../common/table/table';
import LotteryTicketRow from '../lotteryTicketRow/lotteryTicketRow';
import Button from '../common/button/button';

const ROW = [
   { heading: 'Ticket Numbers', cls: 'text-start', w: 'w-2/12 md:w-4/12' },
   { heading: 'Tickets', cls: 'text-center' },
   { heading: 'price', cls: 'text-end' },
];

function MyLotteryTickets() {
   const dispatch = useAppDispatch();

   const user = useAppSelector(userSelector);
   const todayLottery = useAppSelector(todayLotterySelector);
   const loadMoreTickets = useAppSelector(loadMoreTicketsSelector);
   const lotteryTicketError = useAppSelector(lotteryTicketErrorSelector);
   const lotteryTicketLoading = useAppSelector(lotteryTicketLoadingSelector);
   const lotteryTicketInfo = useAppSelector(lotteryTicketInfoSelector);

   const loadMoreHandler = function () {
      const { page } = lotteryTicketInfo!;

      if (!!user && user?.user && user?.user?.userId) {
         const { userId } = user?.user;
         dispatch(
            getUserLotteryTickets({
               userId,
               gameId: todayLottery?.item?._id!,
               page: page + 1,
            }),
         );
      }
   };

   useEffect(() => {
      if (
         !!user &&
         user?.user &&
         user?.user?.userId &&
         !!todayLottery &&
         todayLottery?.success &&
         todayLottery?.item?.gameId
      ) {
         dispatch(
            getUserLotteryTickets({
               userId: user?.user?.userId,
               gameId: todayLottery?.item?._id,
               page: 0,
            }),
         );
      }
   }, [todayLottery]);

   useEffect(() => {
      return () => {
         dispatch(removeTickets());
      };
   }, []);

   return (
      <div>
         <LotteryHeading />
         <div className="px-0 py-0 py-md-2 px-md-4">
            <div className="flex items-center justify-center py-2">
               {!!lotteryTicketLoading && <CircularProgress />}
               {!!lotteryTicketError && lotteryTicketError?.message && (
                  <Error data={lotteryTicketError?.message} />
               )}
               {!!lotteryTicketInfo &&
               lotteryTicketInfo?.success &&
               lotteryTicketInfo?.item &&
               lotteryTicketInfo?.item?.tickets.length ? (
                  <div className="w-full">
                     <TableContainer cl="px-2 py-2">
                        <Table>
                           <TableHeader>
                              <TableRow row={ROW} />
                           </TableHeader>
                           <TableBody>
                              {lotteryTicketInfo?.item?.tickets.map((el) => (
                                 <LotteryTicketRow key={el?._id} data={el} />
                              ))}
                           </TableBody>
                        </Table>
                     </TableContainer>
                     {!!lotteryTicketInfo?.totalPages &&
                        lotteryTicketInfo?.page <
                           lotteryTicketInfo.totalPages && (
                           <div className="load_more_div flex items-center justify-center pt-5">
                              <Button
                                 isLoading={loadMoreTickets}
                                 variation="wallet_button"
                                 onClick={loadMoreHandler}
                              >
                                 Load More
                              </Button>
                           </div>
                        )}
                  </div>
               ) : (
                  !!lotteryTicketInfo &&
                  lotteryTicketInfo?.success &&
                  lotteryTicketInfo?.item &&
                  !lotteryTicketInfo?.item?.tickets.length && (
                     <div>
                        <p className="text-gray-300 font-medium">
                           You have no tickets
                        </p>
                     </div>
                  )
               )}
            </div>
         </div>
      </div>
   );
}

export default MyLotteryTickets;
