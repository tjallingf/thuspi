import { ExtensionController } from '../extensions';
import ModelWithProps from '../lib/ModelWithProps';
import FlowBlock from './extension/FlowBlock/FlowBlock';
import FlowBlockHandler from './FlowBlockHandler';
import _ from 'lodash';
import FlowController from './FlowController';

export interface FlowBlockConfig {
    id: string;
    type: string;
    arguments?: {
        [key: string]: string[];
    };
    children: string[];
}
export interface FlowProps {
    name: string;
    icon: string;
    program: {
        blocks: {
            [key: string]: FlowBlockConfig;
        };
    };
}

export default class Flow extends ModelWithProps<FlowProps> {
    static cnf = {
        controller: FlowController,
    };

    private blockHandlers: { [key: string]: FlowBlockHandler };

    protected init() {
        if (this.blockHandlers) return;

        this.blockHandlers = _.mapValues(this.getProp('blocks'), (blockConfig) => {
            return new FlowBlockHandler(blockConfig, this);
        });
    }

    getBlockHandler(id: string) {
        if (!this.blockHandlers[id]) throw new Error(`Cannot find block handler '${id}' in ${this}.`);

        return this.blockHandlers[id];
    }
}
