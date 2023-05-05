import Model from '../lib/Model';
import ModelWithProps from '../lib/ModelWithProps';
import LanguageController from './LanguageController';
import { LanguageKey, MessagesMap } from './LanguageMessages/LanguageMessages';
import _ from 'lodash';

export interface LanguageProps {
    messages: MessagesMap;
}

export default class Language extends ModelWithProps<LanguageProps> {
    public static cnf = {
        controller: LanguageController,
    };

    constructor(key: LanguageKey) {
        super(key, {
            messages: {},
        });
    }

    addMessages(messages: MessagesMap, prefix: string): void {
        let prefixedMessages = {};

        _.forOwn(messages, (message, id) => {
            prefixedMessages[prefix ? `${prefix}.${id}` : id] = message;
        });

        this.setProp('messages', Object.assign({}, this.getProp('messages'), prefixedMessages));
    }
}
