'use client';

import React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Avatar, AvatarImage } from '../avatar/avatar';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

function Navbar() {
   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
   const open = Boolean(anchorEl);
   const { data: session } = useSession();
   const router = useRouter();

   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   const logOutHandler = function () {
      signOut({ redirect: false });
      router.push('/auth/login');
   };

   return (
      <div className="flex items-center justify-between">
         {!!session && session?.user && session?.user?._id ? (
            <>
               <div></div>
               <div>
                  <Button
                     id="basic-button"
                     aria-controls={open ? 'basic-menu' : undefined}
                     aria-haspopup="true"
                     aria-expanded={open ? 'true' : undefined}
                     onClick={handleClick}
                  >
                     <Avatar>
                        <AvatarImage
                           alt="user profile image"
                           src={session?.user?.avatar}
                        />
                     </Avatar>
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
                     <MenuItem onClick={logOutHandler}>Logout</MenuItem>
                  </Menu>
               </div>
            </>
         ) : null}
      </div>
   );
}

export default Navbar;
