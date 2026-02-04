import React, { createContext, useContext } from 'react';

type User = {
  name: string;
  role: 'PROJECT_ADMIN' | 'PROJECT_SUBMITTER' | 'PROJECT_APPROVER';
  allowedPaths: string[];
};

export const MOCK_USER: User = {
  name: 'Andrei Budaes',
  role: 'PROJECT_ADMIN',
  allowedPaths: [
    '/',
    '/workspace',
    '/activity',
    '/field-mapping',
    '/submissions',
    '/setup/providers',
    '/setup/data-packets',
    '/setup/report-types',
    '/setup/entity-types',
    '/setup/entities',
    '/setup/schedules',
    '/setup/value-mapping-sets',
    '/admin/users',
    '/admin/groups',
    '/admin/permissions',    
    '/admin/subscription',
    '/admin/validation-rules',
    '/admin/integrations',
    '/admin/workspace-settings'
  ],
};

const UserContext = createContext<User>(MOCK_USER);

export const useUser = () => useContext(UserContext);

type UserProviderProps = {
  children: React.ReactNode;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // In the future, replace MOCK_USER with a real user fetched from API or auth token
  return <UserContext.Provider value={MOCK_USER}>{children}</UserContext.Provider>;
};