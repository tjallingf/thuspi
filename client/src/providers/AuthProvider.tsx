import { useState, useEffect } from 'react';
import useQuery from '@/hooks/useQuery';
import AuthContext, { IAuthContext } from '@/contexts/AuthContext';
import UserModel from '@/utils/models/User';

export interface IAuthProviderProps {
  children?: React.ReactNode;
}

const AuthProvider: React.FunctionComponent<IAuthProviderProps> = ({ children }) => {
  const [value, setValue] = useState({} as IAuthContext);

  useEffect(() => {
    if (!value.user) return;
    document.body.dataset.colorScheme = value.user.getSetting('theme');
  }, [value]);

  const { refetch } = useQuery<any>('users/me', {
    onSuccess: (userProps) => {
      setValue({
        isLoggedIn: userProps.id !== 'default',
        user: new UserModel(userProps),
        refresh: refetch,
      });
    },
  });

  if (!value.user) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
