'use client';

import { FC } from 'react';

const ContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="flex min-h-screen flex-col">{children}</div>;
};

export default ContextProvider;
