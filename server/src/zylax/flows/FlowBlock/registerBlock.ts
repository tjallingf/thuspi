import { Constructor } from '@/zylax/types';
import type FlowBlock from './FlowBlock';
import registerModule from '@/zylax/extensions/registerModule';
import validator from './validator';

export default function registerBlock(name: string, callback: () => Constructor<FlowBlock>) {
    registerModule(name, callback, validator);
}
