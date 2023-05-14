import { useState, useEffect } from 'react';
import useQuery from '@/hooks/useQuery';
import AuthContext, { IAuthContext } from '@/contexts/AuthContext';
import User from '@/utils/models/User';
import { trpc } from '~trpc';

export interface IAuthProviderProps {
    children?: React.ReactNode;
}

const AuthProvider: React.FunctionComponent<IAuthProviderProps> = ({ children }) => {
    const [ value, setValue ] = useState({} as IAuthContext);
    const user = trpc.user.get.useQuery({ id: 'me' });

    useEffect(() => {
        if(!user.data) return;

        setValue({
            user: new User(user.data),
            isLoggedIn: !user.data.isDefault,
            refresh: user.refetch
        })
    }, [ user.data ]);

    useEffect(() => {
        if(!value.user) return;
        
        document.body.dataset.colorScheme = value.user.getSetting('theme');
    }, [ value.user ]);
    
    if (!value.user) return null;

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
