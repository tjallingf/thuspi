import EventEmitter from 'events';
import FlowBlockReflection from './FlowBlockReflection';

export interface FlowBlockManifestParameterData {
    type: 'string' | 'number' | 'boolean';
    name: string;
    options: Array<{
        key?: string;
        label?: string | number;
        value: string | number | boolean;
    }>;
    optionsGenerator: {
        callback: (block: FlowBlockReflection) => FlowBlockManifestParameterData['options'];
        dependsOnParameters: string[];
    };
}

export default class FlowBlockManifestParameter {
    data: FlowBlockManifestParameterData = {
        name: null,
        type: 'string',
        options: null,
        optionsGenerator: null,
    };

    constructor(name: string, type: FlowBlockManifestParameterData['type']) {
        this.data.name = name;
        this.data.type = type;
    }

    getName() {
        return this.data.name;
    }

    getType() {
        return this.data.type;
    }

    addOptions(options: FlowBlockManifestParameterData['options']) {
        options.map((o) => this.addOption(o));
        return this;
    }

    getOptions() {
        return this.data.options;
    }

    addOption(option: FlowBlockManifestParameterData['options'][0]) {
        if (!Array.isArray(this.data.options)) {
            this.data.options = [];
        }

        this.data.options.push(option);
        return this;
    }

    getOption(value: FlowBlockManifestParameterData['options'][0]['value']) {
        return this.data.options?.find?.((o) => o.value === value);
    }

    setOptions(options: FlowBlockManifestParameterData['options']) {
        this.data.options = options;
        return this;
    }

    setOptionsGenerator(
        callback: FlowBlockManifestParameterData['optionsGenerator']['callback'],
        dependsOnParameters?: string[],
    ) {
        this.data.optionsGenerator = { callback, dependsOnParameters };
    }

    removeOption(value: string) {
        this.data.options = this.data.options?.filter?.((o) => o.value === value);
        return this;
    }

    toJSON() {
        return this.data;
    }
}
