import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import type { Metadata } from 'next';
import { theme } from '@/styles/theme';
import { ReduxProvider } from '@/store/provider';
import GlobalFeedback from '@/components/common/GlobalFeedback';
import './globals.css';

export const metadata: Metadata = {
  title: 'Boxful - Technical Test',
  description: 'Next.js + Ant Design + Redux',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body>
      <ReduxProvider>
        <AntdRegistry>
          <ConfigProvider theme={theme}>
            <GlobalFeedback />
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </ReduxProvider>
    </body>
  </html>
);

export default RootLayout;
