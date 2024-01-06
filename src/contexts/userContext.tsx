import React, { createContext, useContext, useState } from 'react';
import { UserBase } from '../types/UserAuthTypes';


// Define Types
interface UserContextValue {
  user: UserBase | null;
  setUser: React.Dispatch<React.SetStateAction<UserBase | null>>;
}

interface UserContextProviderProps {
  children: React.ReactNode;
}

// create usercntext
const UserContext = createContext<UserContextValue | undefined>(undefined);

// Make Context Provider
export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [user, setUser] = useState<UserBase | null>(null);

  const value: UserContextValue = { user, setUser };
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUserValue = (): UserBase | null => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserValue must be used within a UserContextProvider');
  }
  return context.user;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUserSet = (): React.Dispatch<React.SetStateAction<UserBase | null>> => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserSet must be used within a UserContextProvider');
  }
  return context.setUser;
};