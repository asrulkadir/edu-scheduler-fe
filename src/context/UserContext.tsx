'use client';

import { useCurrentUser } from '@/hooks/useUser';
import { TUser } from '@/libs/types/user';
import { ERole } from '@/libs/utils/enum';
import React, { createContext, useMemo } from 'react';

const defaultUser: TUser = {
  id: '',
  username: '',
  email: '',
  name: '',
  role: ERole.NONE,
  clientId: '',
};

export const UserContext = createContext<TUser>(defaultUser);

const UserContextProvider = ({
  children,
}: {
  readonly children: React.ReactNode;
}) => {
  const { currentUser } = useCurrentUser();
  const contextValue = useMemo(() => currentUser || defaultUser, [currentUser]);

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
