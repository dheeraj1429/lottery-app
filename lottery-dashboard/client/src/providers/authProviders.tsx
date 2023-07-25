'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

type Props = {
   children: React.ReactNode;
};

export const NextAuthProvider = ({ children }: Props): React.JSX.Element => {
   return <SessionProvider>{children}</SessionProvider>;
};

export const AuthProvider = ({ children }: Props): React.ReactNode => {
   const { data } = useSession({
      required: true,
      onUnauthenticated() {
         redirect('/auth/login');
      },
   });

   // if (!data) {
   //    return null;
   // }

   return children;
};
