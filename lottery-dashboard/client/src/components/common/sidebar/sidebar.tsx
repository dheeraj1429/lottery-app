import React from 'react';
import SidebarTab from '../../sidebarTab/sidebarTab';
import IconList from '../../iconList/iconList';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

function Sidebar() {
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
         </SidebarTab>
      </div>
   );
}

export default Sidebar;
