import { createContext } from 'react';
import UserModel from '@/utils/models/User';
import { Socket } from 'socket.io-client';

export interface ISocketContext extends Socket {}

const SocketContext = createContext(null as ISocketContext);
export default SocketContext;
