'use client';

import { useCurrentAcademicCalendar } from '@/hooks/useAcademicCalendar';
import { useCurrentUser } from '@/hooks/useUser';
import { TAcademicCalendar } from '@/libs/types/academicCalendar';
import { TUser } from '@/libs/types/user';
import { ERole } from '@/libs/utils/enum';
import React, { createContext, useMemo } from 'react';

export type TDefaultState = {
  user: TUser;
  academic: TAcademicCalendar;
  mutateCurrentAcademic: () => void;
};

const defaultState: TDefaultState = {
  user: {
    id: '',
    username: '',
    email: '',
    name: '',
    role: ERole.NONE,
    clientId: '',
  },
  academic: {
    id: '',
    name: '',
    startTime: '',
    endTime: '',
    clientId: '',
  },
  mutateCurrentAcademic: () => {},
};

export const UserContext = createContext<TDefaultState>(defaultState);

const UserContextProvider = ({
  children,
}: {
  readonly children: React.ReactNode;
}) => {
  const { currentUser } = useCurrentUser();
  const { currentAcademic, mutateCurrentAcademic } =
    useCurrentAcademicCalendar();
  const contextValue = useMemo(() => {
    return {
      user: currentUser || defaultState.user,
      academic: currentAcademic || defaultState.academic,
      mutateCurrentAcademic:
        mutateCurrentAcademic || defaultState.mutateCurrentAcademic,
    };
  }, [currentUser, currentAcademic, mutateCurrentAcademic]);

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
