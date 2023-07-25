'use client';

import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import { MouseHandlerType, Props, StateType } from '.';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function PageHeadingComponent({
   pageName,
   subHeading,
   para,
   innerProps,
   menu,
   heading,
}: Props) {
   const [anchorEl, setAnchorEl] = useState<StateType>(null);
   const open = Boolean(anchorEl);

   const handleClick = (event: MouseHandlerType) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   return (
      <div>
         <div className="flex items-center">
            <p className="text-blue-500 font-medium">Dashboard</p>
            <span className="mx-3 text-gray-800">/</span>
            <span className=" text-gray-800 font-medium">{pageName}</span>
         </div>
         <h1 className="mt-2 text-3xl text-gray-800 font-semibold">
            {!!heading ? heading : 'Welcome to Dashboard'}
         </h1>
         <div className="flex items-center justify-between">
            <div>
               {!!subHeading && (
                  <div className="mt-5">
                     <h1 className="text-xl font-medium text-gray-700">
                        {subHeading}
                     </h1>
                  </div>
               )}
               {!!para && <p className="mt-3 text-gray-500 text-sm">{para}</p>}
            </div>
            {menu ? (
               <div className="option_div">
                  <Button
                     id="basic-button"
                     aria-controls={open ? 'basic-menu' : undefined}
                     aria-haspopup="true"
                     aria-expanded={open ? 'true' : undefined}
                     onClick={handleClick}
                  >
                     <MoreHorizIcon className="text-gray-500" />
                  </Button>
                  <Menu
                     id="basic-menu"
                     anchorEl={anchorEl}
                     open={open}
                     onClose={handleClose}
                     MenuListProps={{
                        'aria-labelledby': 'basic-button',
                     }}
                  >
                     {innerProps}
                  </Menu>
               </div>
            ) : null}
         </div>
      </div>
   );
}

export default React.memo(PageHeadingComponent);
