'use client';

import { FC } from "react";
import UserContextProvider from "./UserContext";

const ContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <UserContextProvider>
      {children}
    </UserContextProvider>
  );
};

export default ContextProvider;