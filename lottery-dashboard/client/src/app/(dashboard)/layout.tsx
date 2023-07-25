import React from 'react';
import classes from './layout.module.css';
import Sidebar from '@/components/common/sidebar/sidebar';
import Navbar from '@/components/common/navbar/navbar';
import { AuthProvider } from '@/providers/authProviders';

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <AuthProvider>
         <div className={classes['container_div']}>
            <div className={classes['sidebar_div']}>
               <Sidebar />
            </div>
            <div className={classes['main_div']}>
               <div className={classes['header_div']}>
                  <Navbar />
               </div>
               <div className={classes['render_div']}>{children}</div>
            </div>
         </div>
      </AuthProvider>
   );
}
