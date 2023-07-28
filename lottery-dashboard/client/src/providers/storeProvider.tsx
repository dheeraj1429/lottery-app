'use client';

import React from 'react';
import store from '@/redux/store/store';
import { Provider } from 'react-redux';

export const StoreProvider = function ({
   children,
}: {
   children: React.ReactNode;
}): React.JSX.Element {
   return <Provider store={store}>{children}</Provider>;
};
