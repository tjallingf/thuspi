import { ExtensionController } from '../extensions';
import { Constructor } from '../types';
import FlowBlock from './FlowBlock/FlowBlock';
import FlowBlockManifest from './FlowBlockManifest';

export interface FlowBlockReflectionState {
    args: {
        [key: string]: any;
    };
}

export default class FlowBlockReflection {
    manifest: FlowBlockManifest;
    state: FlowBlockReflectionState;

    constructor(type: string, state: FlowBlockReflectionState) {
        const block = ExtensionController.findModule(FlowBlock, type);
        this.manifest = block.prototype.getManifest();
        this.state = state;
    }

    getParameterValue(name: string) {
        const parameter = this.manifest.getParameter(name);
        return this.parseValue(this.state.args[name]?.value, parameter.getType());
    }

    private parseValue(value: any, type: string) {
        if (type === 'boolean') return !!value;

        if (type === 'string') return typeof value?.toString === 'function' ? value.toString() : value + '';

        if (type === 'number') return parseFloat(value);

        return null;
    }
}
