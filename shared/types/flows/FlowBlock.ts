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
    name: string;
    type: FlowBlockManifestParameterType;
    options?: FlowBlockManifestParameterOption[];
    shadow?: {
        type?: FlowBlockManifestParameterType;
        value?: any;
    };
}

export interface FlowBlockManifestStatement {
    name: string;
}

export interface FlowBlockManifest {
    icon?: string;
    category: string;
    connections?: {
        top?: boolean;
        bottom?: boolean;
    };
    parameters?: FlowBlockManifestParameter[]
    statements?: FlowBlockManifestStatement[],
    output?: {
        type?: FlowBlockManifestParameterType;
    };
    helpUrl?: string
}

export interface FlowBlockManifestSerialized extends Required<FlowBlockManifest> {};