'use client';

import React from 'react';
import { ConfigProvider, theme } from 'antd';

export const AntdThemeProvider = function ({
   children,
}: {
   children: React.ReactNode;
}) {
   const { darkAlgorithm } = theme;

   return (
      <ConfigProvider
         theme={{
            algorithm: darkAlgorithm,
         }}
      >
         {children}
      </ConfigProvider>
   );
};
