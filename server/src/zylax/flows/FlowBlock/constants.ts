import type { FlowBlockManifest } from './FlowBlock';

type FlowBlockParameter = FlowBlockManifest['parameters'][0];

export interface FlowBlockNumberParameterGenerics {
    min: number;
    max: number;
    precision: number;
}

export interface FlowBlockSelectParameterGenerics {
    options: FlowBlockManifest['parameters'][0]['options'][];
}

export const parameters = {
    type: {
        number: (generics?: Partial<FlowBlockNumberParameterGenerics>): FlowBlockParameter['type'] => [
            'Number',
            generics,
        ],
        boolean: (): FlowBlockParameter['type'] => ['Boolean'],
        string: (): FlowBlockParameter['type'] => ['String'],
        void: (): FlowBlockParameter['type'] => [null],
        time: (): FlowBlockParameter['type'] => ['time'],
        date: (): FlowBlockParameter['type'] => ['date'],
    },
    display: {
        select: (generics?: Partial<FlowBlockSelectParameterGenerics>): FlowBlockParameter['display'] => [
            'select',
            generics,
        ],
        field: (): FlowBlockParameter['display'] => ['field'],
        input: (): FlowBlockParameter['display'] => ['input'],
    },
};
