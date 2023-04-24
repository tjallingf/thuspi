import { Extension, ExtensionController } from '../extensions';
import Controller from '../lib/Controller';
import LanguageMessages, { LanguageKey } from './LanguageMessages';
import Language from './Language';
import * as _ from 'lodash';
import Locale from './Language';

const AVAILABLE_LANGUAGES: LanguageKey[] = [ 'nl-nl', 'en-us' ];

export default class LanguageController extends Controller<Language>() {
    static load() {
        let languages = {};

        AVAILABLE_LANGUAGES.forEach(key => {
            const language = new Language(key);

            ExtensionController.index().forEach((extension: Extension) => {
                const messages = extension.getModuleSafe<LanguageMessages>(LanguageMessages.name, key) as typeof LanguageMessages;
                if(!messages) return true;

                language.addMessages(messages.map, extension.id);
            })

            languages[key] = language;
        })

        this.store(languages);
    }
}