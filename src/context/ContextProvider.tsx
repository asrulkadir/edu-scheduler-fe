'use client';

import { FC } from "react";

const ContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default ContextProvider;