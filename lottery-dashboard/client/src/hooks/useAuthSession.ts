'use client';

import { useSession } from 'next-auth/react';

export const useAuthSessions = function () {
   const { data: session } = useSession();
   return session;
};
