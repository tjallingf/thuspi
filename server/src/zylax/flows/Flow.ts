import { ExtensionController } from '../extensions';
import ModelWithProps from '../lib/ModelWithProps';
import FlowBlock from './FlowBlock';
import FlowBlockHandler, { FlowBlockConfig } from './FlowBlockHandler';
import _ from 'lodash';
import FlowController from './FlowController';

export interface FlowProps {
    name: string,
    icon: string,
    blocks: Array<any>
}

export default class Flow extends ModelWithProps<FlowProps> {
    static cnf = {
        controller: FlowController
    }

    private blockHandlers: { [key: string]: FlowBlockHandler };

    protected init() {
        if(this.blockHandlers) return;

        this.blockHandlers = {};
        this.getProp('blocks').forEach((config: FlowBlockConfig) => {
            this.blockHandlers[config.id] = new FlowBlockHandler(config, this);
        })
    }

    getBlockHandler(id: string) {
        if(!this.blockHandlers[id])
            throw new Error(`Cannot find block handler '${id}' in ${this}.`);

        return this.blockHandlers[id];
    }
}