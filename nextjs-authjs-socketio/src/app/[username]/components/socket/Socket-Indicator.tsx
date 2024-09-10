'use client';

import { useSocket } from './Socket-Provider';

export const SocketIndicator = () => {
  const { isConnected } = useSocket();
  if (!isConnected) {
    return <div>Not connected</div>;
  }
  return <div>Connected</div>;
};
