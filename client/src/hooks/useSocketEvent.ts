import { useEffect } from 'react';
import useSocket from './useSocket';

function useSocketEvent(type: string, listener: (...args: any[]) => void) {
    const socket = useSocket();
    useEffect(() => {
        socket.on(type, listener);

        return () => {
            socket.off(type, listener);
        };
    });
}

export default useSocketEvent;
