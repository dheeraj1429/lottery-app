'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { getMyLotteryWinning } from '@/redux/features/luckyDraw/luckyDrawActions';
import {
   userSelector,
   myWinningsSelector,
   myWinningsLoadingSelector,
   myWinningsErrorSelector,
   myWinningsLoadMoreSelector,
} from './myLotteryWinning.selector';
import Error from '../common/error/error';
import { CircularProgress } from '@mui/material';
import NoData from '../common/noData/noData';
import {
   Table,
   TableBody,
   TableContainer,
   TableHeader,
   TableRow,
} from '../common/table/table';
import LotteryTicketRow from '../lotteryTicketRow/lotteryTicketRow';
import Button from '../common/button/button';

const Row = [
   { heading: 'Numbers', cls: 'text-start' },
   { heading: 'Matches', cls: 'text-center' },
   { heading: 'Price', cls: 'text-center' },
   { heading: 'Created At', cls: 'text-end' },
];

function MyLotteryWinning() {
   const dispatch = useAppDispatch();

   const userInfo = useAppSelector(userSelector);
   const myWinnings = useAppSelector(myWinningsSelector);
   const myWinningsLoading = useAppSelector(myWinningsLoadingSelector);
   const myWinningsError = useAppSelector(myWinningsErrorSelector);
   const myWinningsLoadMore = useAppSelector(myWinningsLoadMoreSelector);

   const loadMoreHandler = function () {
      const page = myWinnings?.page;
      if (!!userInfo && userInfo?.user && userInfo?.user?.userId && page) {
         dispatch(
            getMyLotteryWinning({
               page: page + 1,
               userId: userInfo?.user?.userId,
            }),
         );
      }
   };

   useEffect(() => {
      if (!!userInfo && userInfo?.user && userInfo?.user?.userId) {
         dispatch(
            getMyLotteryWinning({ page: 0, userId: userInfo?.user?.userId }),
         );
      }
   }, []);

   return (
      <div>
         {!!myWinningsLoading && (
            <div className="flex items-center justify-center">
               <CircularProgress />
            </div>
         )}
         {!!myWinningsError && myWinningsError?.message && (
            <Error data={myWinningsError?.message} />
         )}
         {!!myWinnings &&
         myWinnings?.success &&
         myWinnings?.winningData &&
         myWinnings?.winningData?.winnings &&
         myWinnings?.winningData?.winnings.length ? (
            <div className="w-full">
               <TableContainer cl="px-2 py-2">
                  <Table>
                     <TableHeader>
                        <TableRow row={Row} />
                     </TableHeader>
                     <TableBody>
                        {myWinnings?.winningData?.winnings.map((el, idx) => (
                           <LotteryTicketRow
                              key={el?._id || idx + 'key'}
                              data={el}
                              matchResult={{
                                 luckyNumbers: el?.matches,
                                 jackpotBallNumber: el?.jackpotBallNumberMatch,
                              }}
                              showData={true}
                           />
                        ))}
                     </TableBody>
                  </Table>
               </TableContainer>
               {myWinnings?.totalPages &&
               myWinnings?.totalPages > myWinnings?.page ? (
                  <div className="flex items-center justify-center pt-4 pb-3">
                     <Button
                        onClick={loadMoreHandler}
                        isLoading={myWinningsLoadMore}
                        variation="wallet_button"
                     >
                        Load More
                     </Button>
                  </div>
               ) : null}
            </div>
         ) : !myWinningsLoading ? (
            <div className="flex items-center justify-center p-2">
               <NoData />
            </div>
         ) : null}
      </div>
   );
}

export default MyLotteryWinning;
