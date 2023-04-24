import registerModule from '../extensions/registerModule';
import LanguageMessages, { MessagesMap } from './LanguageMessages';
import { LanguageKey } from './LanguageMessages';
import _ from 'lodash';

function initMessages(messages: MessagesMap) {
    return class extends LanguageMessages {
        static map = messages;
    }
}

export function registerMessages(key: LanguageKey, messages: MessagesMap) {
    registerModule(key, (extension) => {
        if(_.isPlainObject(messages)) {
            return class extends LanguageMessages {
                static map = messages;
            }
        }

        return null;
    });
}