import { Constructor } from '../types';
import type FlowBlock from './FlowBlock';
import registerModule from '../extensions/registerModule';

export function registerBlock(tag: string, callback: () => Constructor<FlowBlock>) {
    registerModule(tag, callback);
}

export { default as Flow } from './Flow';
export { default as FlowBlock } from './FlowBlock';
export { default as FlowController } from './FlowController';