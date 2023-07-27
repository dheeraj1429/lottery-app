'use client';

import React from 'react';
import SidebarTab from '../../sidebarTab/sidebarTab';
import IconList from '../../iconList/iconList';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import useRole from '@/hooks/useRole';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

function Sidebar() {
   const { isSubAdmin } = useRole();

   return (
      <div>
         <SidebarTab heading={'Dashboard'}>
            <IconList
               heading={'Dashboard'}
               icon={<DashboardIcon />}
               link={'/'}
            />
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
         </SidebarTab>
      </div>
   );
}

export default Sidebar;
