'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/store/hooks';
import PageHeading from '@/components/common/pageHeading/PageHeading';
import withRoles from '@/hoc/withRoles';
import { getAllLottery } from '@/redux/features/luckyDraw/luckyDrawActions';
import LotteryCards from '@/components/lotteryCards/lotteryCards';

function Lottery() {
   const dispatch = useAppDispatch();

   useEffect(() => {
      dispatch(getAllLottery({ page: 0 }));
   }, []);

   return (
      <div>
         <PageHeading
            heading={'Welcome to dashboard'}
            pageName={'All lottery games'}
            para={
               'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as'
            }
         />
         <LotteryCards />
      </div>
   );
}

export default withRoles(Lottery, ['admin']);
