import { createContext } from 'react';
import UserModel from '@/utils/models/UserModel';

export interface IAuthContext {
    isLoggedIn: boolean,
    user: UserModel,
    refresh(): Promise<{}>
}

const AuthContext = createContext({} as IAuthContext);
export default AuthContext;