import React from 'react';
import { motion } from 'framer-motion';
import classes from './successPopUp.module.css';
import SheetPortal, { SheetOverlay } from '../common/portal/portal';
import Image from 'next/image';

function SuccessPopUp({ heading, para }: { heading: string; para: string }) {
   return (
      <SheetPortal>
         <SheetOverlay />
         <div className="text-center">
            <motion.div
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.8, opacity: 0 }}
               className={classes['success_div']}
            >
               <Image
                  width={250}
                  height={250}
                  src="/images/success-check-mark.gif"
                  alt="Success image"
               />
               <p className="text-xl text-gray-200 mt-2">{heading}</p>
               <p className="mt-2 text-sm text-gray-300">{para}</p>
            </motion.div>
         </div>
      </SheetPortal>
   );
}

export default SuccessPopUp;
