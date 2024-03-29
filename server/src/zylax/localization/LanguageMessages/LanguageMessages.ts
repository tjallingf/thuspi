import { ExtensionModule } from '../../extensions';

export type LanguageKey = 'nl-nl' | 'en-us';

export type MessagesMap = {
    [key: string]: string | MessagesMap;
};

export default class LanguageMessages extends ExtensionModule {
    static map: MessagesMap;
}
