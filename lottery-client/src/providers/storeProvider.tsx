'use client';

import store from '@/redux/store/store';
import React from 'react';
import { Provider } from 'react-redux';

export const StoreProvider = function ({
   children,
}: {
   children: React.ReactNode;
}): React.JSX.Element {
   return <Provider store={store}>{children}</Provider>;
};
