import useAuth from '@/hooks/useAuth';
import useQuery from '@/hooks/useQuery';
import { trpc } from '@/utils/trpc';
import { IntlProvider } from 'react-intl';

export interface ILanguageProviderProps {
    children?: React.ReactNode;
}

const LanguageProvider: React.FunctionComponent<ILanguageProviderProps> = ({ children }) => {
    const { user } = useAuth();
    const languageKey = user.getSetting('language').toLowerCase();
    const language = trpc.language.get.useQuery({ key: languageKey });

    if (language.isLoading) return <span>Loading language...</span>;

    const handleError = (err) => {
        if (err.message.includes('The intl string context variable') && err.descriptor.id.includes('flows.blocks')) {
            const paramId = /context variable "([\w. -]+)" was not/.test(err)[2];
            console.log(paramId);
        }
    };

    return (
        <IntlProvider locale={languageKey} messages={language.data.messages}>
            {children}
        </IntlProvider>
    );
};

export default LanguageProvider;
