'use client';

import React from 'react';
import SidebarTab from '../../sidebarTab/sidebarTab';
import IconList from '../../iconList/iconList';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import useRole from '@/hooks/useRole';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import GamepadIcon from '@mui/icons-material/Gamepad';

function Sidebar() {
   const { isAdmin, isSubAdmin } = useRole();

   return (
      <div>
         <SidebarTab heading={'Dashboard'}>
            <IconList
               heading={'Dashboard'}
               icon={<DashboardIcon />}
               link={'/'}
            />
            {isAdmin ? (
               <>
                  <IconList
                     heading={'Roles'}
                     icon={<AdminPanelSettingsIcon />}
                     link={'/roles'}
                  />
                  <IconList
                     heading={'Accounts'}
                     icon={<SupervisorAccountIcon />}
                     link={'/account'}
                  />
                  <IconList
                     heading="Lottery"
                     icon={<GamepadIcon />}
                     link={'/lottery'}
                  />
               </>
            ) : null}
            {isSubAdmin ? (
               <IconList
                  heading={'Configurations'}
                  icon={<ToggleOffIcon />}
                  link={'/config'}
               />
            ) : null}
         </SidebarTab>
      </div>
   );
}

export default Sidebar;
