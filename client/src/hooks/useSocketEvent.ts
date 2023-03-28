import { useEffect } from 'react';
import { EventEmitter } from 'stream';

type CallbackFunction = (...args: any[]) => void;

function useSocketEvent(type: string, listener: CallbackFunction) {
    useEffect(() => {
        (window as any).socket.on(type, listener);

        return () => {
            (window as any).socket.off(type, listener);
        }
    })
}

export default useSocketEvent;