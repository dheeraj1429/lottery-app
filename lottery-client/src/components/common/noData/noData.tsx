import React from 'react';
import classes from './noData.module.css';
import Image from 'next/image';

interface Props {
   heading?: string;
}

function NoData({ heading }: Props) {
   return (
      <div className={classes['main_div']}>
         <p className="text-gray-400 text-sm font-medium">{heading}</p>
         <div className={classes['ig_div']}>
            <div className="text-center">
               <Image
                  src={'/images/empty.webp'}
                  alt="No data found!"
                  width={200}
                  height={200}
               />
               <div className={classes['erro_text']}>
                  <p className="text-gray-500">Ooops! there is no data.</p>
               </div>
            </div>
         </div>
      </div>
   );
}

export default NoData;
