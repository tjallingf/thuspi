import AuthProvider from '@/providers/AuthProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/utils/queryClient';
import LanguageProvider from '@/providers/LanguageProvider';

export interface IProvidersProps {
  children?: React.ReactNode;
}

const Providers: React.FunctionComponent<IProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default Providers;
