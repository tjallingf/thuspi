import { createContext } from 'react';
import UserModel from '@/utils/models/User';

export interface IAuthContext {
    isLoggedIn: boolean;
    user: UserModel;
    refresh(): Promise<object>;
}

const AuthContext = createContext({} as IAuthContext);
export default AuthContext;
