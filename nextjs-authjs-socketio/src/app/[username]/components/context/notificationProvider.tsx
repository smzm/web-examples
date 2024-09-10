'use client';
import {
  Dispatch,
  SetStateAction,
  createContext,
  startTransition,
  useContext,
  useState,
} from 'react';
import getNotification from '../../actions/getNotification';

type TNotification = {
  notification: any;
  setNotification: Dispatch<SetStateAction<any>>;
};
const NotificationContext = createContext<TNotification>({
  notification: [],
  setNotification: () => {},
});

export default function NotificationProvider({
  children,
  notifications,
}: {
  children: React.ReactNode;
  notifications: string[];
}) {
  const [notification, setNotification] = useState<any>(notifications);

  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context === undefined) {
    throw new Error(
      'useNotoification must be used within a NotificationProvider',
    );
  }
  return context;
}
