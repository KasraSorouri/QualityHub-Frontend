import { useEffect } from 'react';
import { socket } from './socketService';

export const useSocketEvent = <T> (event: string, callback: (data: T) => void) => {
  useEffect(() => {
    console.log(`Subscribing to WebSocket event: ${event}`);
    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [event, callback]);
};