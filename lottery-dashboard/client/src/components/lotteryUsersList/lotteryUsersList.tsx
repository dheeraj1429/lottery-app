'use client';

import { singleLotteryDrawUsersList } from '@/redux/features/luckyDraw/luckyDrawActions';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import {
   singleLotteryUsersSelector,
   singleLotteryUsersLoadingSelector,
   singleLotteryUsersErrorSelector,
} from './lotteryUsers.selector';
import Error from '../common/error/error';
import { CircularProgress } from '@mui/material';
import {
   Table,
   TableContainer,
   TableChildContainer,
   TableBody,
   TableRow,
   TableHeader,
   NextAndPrevButtons,
} from '@/components/common/table/table';
import UserTicketList from '../userTicketList/userTicketList';

const ROW = [
   // { heading: 'Avatar' },
   // { heading: 'Name' },
   { heading: 'Tickets' },
   { heading: 'Numbers of tickets' },
   { heading: 'Price' },
   { heading: 'Is used' },
   { heading: 'Is refund ticket' },
   { heading: 'Created at' },
];

function LotteryUsersList({ filter }: { filter: string }) {
   const params = useParams();
   const gameId = params?.slug[1];
   const [Page, setPage] = useState(0);

   const dispatch = useAppDispatch();
   const singleLotteryUsers = useAppSelector(singleLotteryUsersSelector);
   const singleLotteryUsersLoading = useAppSelector(
      singleLotteryUsersLoadingSelector,
   );
   const singleLotteryUsersError = useAppSelector(
      singleLotteryUsersErrorSelector,
   );

   useEffect(() => {
      dispatch(
         singleLotteryDrawUsersList({
            gameId,
            filter: filter,
            page: Page,
         }),
      );
   }, [Page]);

   return (
      <div>
         {!!singleLotteryUsersLoading && (
            <div className="w-full h-full flex items-center justify-center p-5">
               <CircularProgress />
            </div>
         )}
         {!!singleLotteryUsersError && singleLotteryUsersError?.message && (
            <Error data={singleLotteryUsersError?.message} />
         )}
         {!!singleLotteryUsers &&
         singleLotteryUsers?.success &&
         singleLotteryUsers?.items &&
         singleLotteryUsers?.items?.lotteryData &&
         singleLotteryUsers?.items?.lotteryData.length ? (
            <TableContainer>
               <TableChildContainer>
                  <Table>
                     <TableHeader>
                        <TableRow row={ROW} />
                     </TableHeader>
                     <TableBody>
                        {singleLotteryUsers?.items?.lotteryData.map((el) => (
                           <UserTicketList
                              clientId={el?.clientId}
                              userId={el?.userId}
                              key={el?._id}
                              lotteryNumbers={el?.lotteryNumbers}
                              isUsed={el?.isUsed}
                              numberOfTickets={el?.numberOfTickets}
                              price={el?.price}
                              refundTicket={el?.refundTicket}
                              _id={el?._id}
                              createdAt={el?.createdAt}
                           />
                        ))}
                     </TableBody>
                  </Table>
               </TableChildContainer>
               <NextAndPrevButtons
                  nextAndPrev={true}
                  disablePrevbtn={Page === 0 ? true : false}
                  disableNextbtn={
                     Page >= singleLotteryUsers?.totalPages ? true : false
                  }
               ></NextAndPrevButtons>
            </TableContainer>
         ) : !singleLotteryUsersLoading ? (
            <div className="text-center w-full">
               <p className="text-gray-400 text-sm">No tickets placed</p>
            </div>
         ) : null}
      </div>
   );
}

export default LotteryUsersList;
