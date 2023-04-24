import useAuth from '@/hooks/useAuth';
import useQuery from '@/hooks/useQuery';
import { IntlProvider } from 'react-intl';

export interface ILanguageProviderProps {
  children?: React.ReactNode;
}

const LanguageProvider: React.FunctionComponent<ILanguageProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const languageKey = user.getSetting('language').toLowerCase();
  const { result, isLoading } = useQuery<any>(`languages/${languageKey}`);

  if (isLoading) return <span>Loading language...</span>;

  return (
    <IntlProvider locale={languageKey} messages={result.messages}>
      {children}
    </IntlProvider>
  );
};

export default LanguageProvider;
