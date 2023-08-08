'use client';

import { useEffect } from 'react';
import classes from './error.module.css';

export default function Error({
   error,
   reset,
}: {
   error: Error;
   reset: () => void;
}) {
   useEffect(() => {
      console.log(error);
   }, [error]);

   return (
      <div>
         <div className={classes['flex-container']}>
            <div className={classes['text-center']}>
               <h1>
                  <span className={classes['fade-in']} id="digit1">
                     4
                  </span>
                  <span className={classes['fade-in']} id="digit2">
                     0
                  </span>
                  <span className={classes['fade-in']} id="digit3">
                     4
                  </span>
               </h1>
               <h3 className="fadeIn">{error?.message}</h3>
               <button onClick={() => reset()} type="button" name="button">
                  Return To Home
               </button>
            </div>
         </div>
      </div>
   );
}
