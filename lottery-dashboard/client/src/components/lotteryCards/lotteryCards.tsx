import React from 'react';
import {
   allLotterySelector,
   allLotteryLoadingSelector,
   allLotteryErrorSelector,
   loadMoreLotteryTicketsSelector,
} from './lottery.selector';
import { getAllLottery } from '@/redux/features/luckyDraw/luckyDrawActions';
import Error from '../common/error/error';
import Button from '../common/button/button';
import classes from './Lottery.module.css';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import TicketCard from '../ticketCard/ticketCard';

function LotteryCards() {
   const dispatch = useAppDispatch();

   const allLottery = useAppSelector(allLotterySelector);
   const allLotteryLoading = useAppSelector(allLotteryLoadingSelector);
   const allLotteryError = useAppSelector(allLotteryErrorSelector);
   const loadMoreLotteryTickets = useAppSelector(
      loadMoreLotteryTicketsSelector,
   );

   const loadMoreHandler = function (page: number) {
      dispatch(getAllLottery({ page: page + 1 }));
   };

   return (
      <div>
         {!!allLotteryLoading && (
            <div className="flex items-center justify-center p-3">
               <CircularProgress />
            </div>
         )}
         {!!allLotteryError && allLotteryError?.message && (
            <Error data={allLotteryError?.message} />
         )}
         {!!allLottery &&
         allLottery?.success &&
         allLottery?.items &&
         !!allLottery?.items.length ? (
            <div>
               <div className={`${classes['lottery_Card_div']} mt-5`}>
                  {allLottery?.items.map((el) => (
                     <TicketCard data={el} key={el?._id} />
                  ))}
               </div>
               {!!allLottery?.totalPages &&
               allLottery?.page < allLottery?.totalPages ? (
                  <div className="load_more_div flex items-center justify-center mt-4">
                     <Button
                        variation="wallet_button"
                        isLoading={loadMoreLotteryTickets}
                        onClick={() => loadMoreHandler(allLottery?.page)}
                     >
                        Load More
                     </Button>
                  </div>
               ) : null}
            </div>
         ) : (
            !allLotteryLoading && (
               <div className="text-center mt-4">
                  <p className="text-sm text-gray-300">
                     No lottery poll is live.
                  </p>
               </div>
            )
         )}
      </div>
   );
}

export default LotteryCards;
