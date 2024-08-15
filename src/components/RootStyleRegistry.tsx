'use client';
import { useState, type PropsWithChildren } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider, ThemeConfig } from 'antd';

const config: ThemeConfig = {
  token: {
    colorPrimary: '#3B81F6',
    colorLink: '#3B81F6',
    colorSuccess: '#68D391',
    colorWarning: '#F6AD55',
    colorError: '#FC8181',
    colorInfo: '#63B3ED',
  },
};

export const RootStyleRegistry = ({ children }: PropsWithChildren) => {
  const [cache] = useState(() => createCache());

  useServerInsertedHTML(() => {
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `</script>${extractStyle(cache)}<script>`,
        }}
      />
    );
  });

  return (
    <StyleProvider cache={cache}>
      <ConfigProvider theme={config}>{children}</ConfigProvider>
    </StyleProvider>
  );
};
