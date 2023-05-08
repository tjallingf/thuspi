import { ExtensionModule } from '../../extensions';
// import FlowBlockManifest from '../FlowBlockManifest';

export type FlowBlockManifestParameterValidTypes = 'string' | 'number' | 'boolean' | 'color' | 'any';
export type FlowBlockManifestParameterType =
    | FlowBlockManifestParameterValidTypes
    | FlowBlockManifestParameterValidTypes[];
export type FlowBlockManifestParameterValue = string | number | boolean | null | undefined;

export type FlowBlockManifestParameterOption = {
    key?: string;
    label?: string;
    value: FlowBlockManifestParameterValue;
};

export interface FlowBlockManifestParameter {
    blockly?: any;
    type: FlowBlockManifestParameterType;
    options?: FlowBlockManifestParameterOption[];
    shadow?: {
        type?: FlowBlockManifestParameterType;
        value?: any;
    };
}

export interface FlowBlockManifest {
    icon?: string;
    category: string;
    connections?: {
        top?: boolean;
        bottom?: boolean;
    };
    parameters?: {
        [key: string]: FlowBlockManifestParameter;
    };
    statements?: {
        [key: string]: Object;
    };
    output?: {
        type?: FlowBlockManifestParameterType;
    };
}

export default class FlowBlock extends ExtensionModule {
    constructor() {
        super();
    }

    run(args): any {
        return false;
    }

    getManifest(): FlowBlockManifest {
        return;
    }
}
