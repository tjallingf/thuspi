import { Constructor } from '@/zylax/types';
import type FlowBlockCategory from './FlowBlockCategory';
import registerModule from '@/zylax/extensions/registerModule';

export default function registerBlockCategory(id: string, callback: () => Constructor<FlowBlockCategory>) {
    registerModule(id, callback, null);
}
