import { useState, createContext, useContext } from 'react';
import { NotificationType } from '../types/Notification';

//Define types
interface NotificationContextValue {
  notification: NotificationType | null;
  setNotification: React.Dispatch<React.SetStateAction<NotificationType | null>>;
}

interface NotificationContextProviderProps {
  children: React.ReactNode;
}


const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationContextProvider = ({ children }: NotificationContextProviderProps) => {
  const [notification, setNotification] = useState<NotificationType| null>(null);

  const value: NotificationContextValue = { notification, setNotification };
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotificationValue = (): NotificationType | null => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useUserValue must be used within a UserContextProvider');
  }
  return context.notification;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotificationSet = () : React.Dispatch<React.SetStateAction<NotificationType | null>> => {
  const context  = useContext(NotificationContext);
  if (!context) {
    throw new Error('useUserValue must be used within a UserContextProvider');
  }
  return context?.setNotification;
};

export default NotificationContext;