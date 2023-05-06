import LanguageMessages, { LanguageKey, MessagesMap } from './LanguageMessages';
import registerModule from '../../extensions/registerModule';
import { flattenKeys } from '../../utils/object';
import _ from 'lodash';

export default function registerMessages(key: LanguageKey, messages: MessagesMap) {
    registerModule(key, (extension) => {
        if (_.isPlainObject(messages)) {
            // Convert the messages to a flat map with dot notation
            messages = flattenKeys(messages);

            return class extends LanguageMessages {
                static map = messages;
            };
        }

        return null;
    });
}
