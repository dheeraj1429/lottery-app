'use client';

import React from 'react';
import useRole from '@/hooks/useRole';
import { redirect } from 'next/navigation';

function withRoles<T>(
   Component: React.ComponentType<T>,
   allowedRoles: string[],
) {
   return (props: T) => {
      const { isLoading, roleName } = useRole();

      let hasAccess = null;

      if (isLoading) {
         return (
            <div className="w-full h-full flex items-center justify-center">
               <h1>Loading...</h1>
            </div>
         );
      }

      if (!isLoading && allowedRoles) {
         hasAccess = allowedRoles.some((el) => el === roleName);
      }

      if (!isLoading) {
         if (!hasAccess) {
            redirect('/');
         } else {
            return <Component {...props!} />;
         }
      }
   };
}

export default withRoles;
