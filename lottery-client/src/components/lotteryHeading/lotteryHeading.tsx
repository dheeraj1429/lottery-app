import React, { Fragment } from 'react';
import { Select, Space } from 'antd';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import {
   todayLotteryErrorSelector,
   todayLotteryLoadingSelector,
   todayLotterySelector,
} from './lottery.Selector';
import Error from '../common/error/error';
import classes from './lotteryHeading.module.css';

function LotteryHeading({ gameId, date }: { gameId?: number; date?: Date }) {
   const todayLottery = useSelector(todayLotterySelector);
   const todayLotteryLoading = useSelector(todayLotteryLoadingSelector);
   const todayLotteryError = useSelector(todayLotteryErrorSelector);

   return (
      <div
         className={`${classes['main_div']} flex items-center justify-between`}
      >
         {!!todayLotteryError && todayLotteryError?.message && (
            <Error data={todayLotteryError?.message} />
         )}
         {!!todayLottery &&
            todayLottery?.success &&
            todayLottery?.item &&
            !todayLotteryLoading && (
               <Fragment>
                  <div className="flex items-center space-x-5">
                     <div className="text-gray-300 font-medium text-sm md:text-lg">
                        Game ID
                     </div>
                     <div className="input_div">
                        <Space wrap>
                           <Select
                              defaultValue={
                                 !!gameId ? gameId : todayLottery?.item?.gameId
                              }
                              disabled
                              options={[
                                 {
                                    value: !!gameId
                                       ? gameId
                                       : todayLottery?.item?.gameId,
                                    label: !!gameId
                                       ? gameId
                                       : todayLottery?.item?.gameId,
                                 },
                              ]}
                           />
                        </Space>
                     </div>
                     <div className="game_date_div d-none d-md-block">
                        <p className="text-gray-300 font-medium">
                           {dayjs(
                              !!date
                                 ? date
                                 : todayLottery?.item?.lotteryPollResultTime,
                           ).format('MMMM DD hh:mm:ss A')}
                        </p>
                     </div>
                  </div>
                  <div className="pr_div"></div>
               </Fragment>
            )}
      </div>
   );
}

export default LotteryHeading;
