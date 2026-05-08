import React from 'react';
import { Button, Result } from 'antd';

export default function Home() {
  return (
    <main style={{ padding: '50px' }}>
      <Result
        status="success"
        title="Next.js + Ant Design Project Ready!"
        subTitle="The environment is configured with Docker and Axios interceptors for JWT."
        extra={[
          <Button type="primary" key="figma">
            Ready for Figma 
          </Button>,
        ]}
      />
    </main>
  );
}
