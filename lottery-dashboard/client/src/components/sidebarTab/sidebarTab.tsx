'use client';

import React, { useState } from 'react';
import { Props } from '.';
import classes from './sidebarTab.module.css';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function SidebarTab({ heading, children }: Props) {
   const [ShowInnerTabs, setShowInnerTabs] = useState<boolean>(false);

   const ShowAndHideTabs = function () {
      setShowInnerTabs(!ShowInnerTabs);
   };

   return (
      <div
         className={
            !!ShowInnerTabs
               ? `${classes['main_div']} ${classes['active_tb']}`
               : `${classes['main_div']}`
         }
      >
         <div className={classes['content_div']} onClick={ShowAndHideTabs}>
            <p className="text-gray-700 font-medium">{heading}</p>
            <div className="arrow_icon">
               <ArrowDropDownIcon
                  className={`text-gray-800 text-xl ar-right ${
                     ShowInnerTabs && 'down'
                  }`}
               />
            </div>
         </div>
         <div className="px-2">{children}</div>
      </div>
   );
}

export default SidebarTab;
