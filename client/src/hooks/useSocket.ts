import SocketContext, { ISocketContext } from '@/contexts/SocketContext';
import { useContext } from 'react';

export default function useSocket(): ISocketContext {
    return useContext(SocketContext);
}
