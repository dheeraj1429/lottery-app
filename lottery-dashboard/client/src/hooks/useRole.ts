'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface AuthRoleInterceptor {
   isAdmin: boolean;
   isSubAdmin: boolean;
   roleName: string | null;
   isLoading: boolean;
}

const checkRole = function (role: string, roleValue: string) {
   const isValidRole = role === roleValue;
   return isValidRole;
};

const useRole = function () {
   const [role, setRole] = useState<AuthRoleInterceptor>({
      isAdmin: false,
      isSubAdmin: false,
      isLoading: true,
      roleName: '',
   });

   const { data: session } = useSession();

   useEffect(() => {
      if (!!session && session?.user && session?.user?.role) {
         const rl = session?.user?.role?.roleName;

         setRole({
            isAdmin: checkRole(rl, 'admin'),
            isSubAdmin: checkRole(rl, 'subAdmin'),
            isLoading: false,
            roleName: rl,
         });
      }
   }, [session]);

   return role;
};

export default useRole;
