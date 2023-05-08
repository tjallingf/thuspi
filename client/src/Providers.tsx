import AuthProvider from '@/providers/AuthProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/utils/queryClient';
import LanguageProvider from '@/providers/LanguageProvider';
import SocketProvider from '@/providers/SocketProvider';

export interface IProvidersProps {
    children?: React.ReactNode;
}

const Providers: React.FunctionComponent<IProvidersProps> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <LanguageProvider>
                    <SocketProvider>{children}</SocketProvider>
                </LanguageProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default Providers;
