import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import type { Metadata } from 'next';
import { ReduxProvider } from '@/store/provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Technical Test - Boxfull',
  description: 'Next.js + Ant Design + Redux',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body>
      <ReduxProvider>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#1677ff',
                borderRadius: 6,
              },
            }}
          >
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </ReduxProvider>
    </body>
  </html>
);

export default RootLayout;
