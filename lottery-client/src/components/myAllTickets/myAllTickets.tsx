'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { getMyAllLotteryTickets } from '@/redux/features/luckyDraw/luckyDrawActions';
import {
   authSelector,
   myAllLotteryTicketsSelector,
   myAllLotteryTicketsLoadingSelector,
   myAllLotteryTicketsErrorSelector,
   myAllLotteryTicketsLoadMoreSelector,
} from './myAllTickets.selector';
import { CircularProgress } from '@mui/material';
import Error from '../common/error/error';
import {
   Table,
   TableBody,
   TableContainer,
   TableHeader,
   TableRow,
} from '../common/table/table';
import Button from '../common/button/button';
import NoData from '../common/noData/noData';
import LotteryTicketRow from '../lotteryTicketRow/lotteryTicketRow';
import { removeAllMyTickets } from '@/redux/features/luckyDraw/luckyDrawSlice';

const ROW = [
   { heading: 'Ticket Numbers', cls: 'text-start', w: 'w-2/12 md:w-4/12' },
   { heading: 'Tickets', cls: 'text-center' },
   { heading: 'Game Id', cls: 'text-center' },
   { heading: 'createdAt', cls: 'text-end' },
];

function MyAllTickets() {
   const [page, setPage] = useState(0);

   const dispatch = useAppDispatch();

   const auth = useAppSelector(authSelector);
   const myAllLotteryTickets = useAppSelector(myAllLotteryTicketsSelector);
   const myAllLotteryTicketsLoading = useAppSelector(
      myAllLotteryTicketsLoadingSelector,
   );
   const myAllLotteryTicketsError = useAppSelector(
      myAllLotteryTicketsErrorSelector,
   );
   const myAllLotteryTicketsLoadMore = useAppSelector(
      myAllLotteryTicketsLoadMoreSelector,
   );

   const loadMoreHandler = function () {
      setPage((prev) => prev + 1);
   };

   useEffect(() => {
      if (!!auth && auth?.success && auth?.user && auth?.user?.userId)
         dispatch(getMyAllLotteryTickets({ userId: auth?.user?.userId, page }));
   }, [auth, page]);

   useEffect(() => {
      return () => {
         dispatch(removeAllMyTickets());
      };
   }, []);

   return (
      <div>
         {!!myAllLotteryTicketsLoading ? (
            <div className="flex items-center justify-center p-2">
               <CircularProgress />
            </div>
         ) : null}
         {!!myAllLotteryTicketsError && myAllLotteryTicketsError?.message ? (
            <Error data={myAllLotteryTicketsError?.message} />
         ) : null}
         <div>
            {!!myAllLotteryTickets &&
            myAllLotteryTickets?.success &&
            myAllLotteryTickets?.items &&
            myAllLotteryTickets?.items &&
            myAllLotteryTickets?.items?.length ? (
               <div className="w-full">
                  <TableContainer cl="px-2 py-2">
                     <Table>
                        <TableHeader>
                           <TableRow row={ROW} />
                        </TableHeader>
                        <TableBody>
                           {myAllLotteryTickets?.items.map((el) => (
                              <LotteryTicketRow
                                 key={el?._id}
                                 data={el}
                                 showData={true}
                                 showGameId={true}
                              />
                           ))}
                        </TableBody>
                     </Table>
                  </TableContainer>
                  {myAllLotteryTickets?.totalPages &&
                  myAllLotteryTickets?.totalPages > page ? (
                     <div className="flex items-center justify-center pt-4 pb-3">
                        <Button
                           onClick={loadMoreHandler}
                           isLoading={myAllLotteryTicketsLoadMore}
                           variation="wallet_button"
                        >
                           Load More
                        </Button>
                     </div>
                  ) : null}
               </div>
            ) : !myAllLotteryTicketsLoading ? (
               <div className="flex items-center justify-center p-2">
                  <NoData />
               </div>
            ) : null}
         </div>
      </div>
   );
}

export default MyAllTickets;
