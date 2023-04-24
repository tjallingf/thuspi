import { ExtensionModule } from '../extensions';

export interface FlowBlockManifest {
    parameters: {
        name: string,
        type: string[]
    }[],
    returns: {
        type: string[]
    }
}

export default class FlowBlock extends ExtensionModule {
    run(args): any {
        return false;
    }

    getManifest(): FlowBlockManifest {
        return;
    }

    static type = {
        trigger: () => [ 'trigger', null ],
        action: (subType: 'switch') => [ 'action', subType ]
    }

    static parameters = {
        type: {
            time: (format?: string) => [ 'time', format ],
            number: () => [ 'number', null ],
            boolean: () => [ 'boolean', null],
            string: () => [ 'string', null ],
            date: () => [ 'Date', null ]
        }
    }
}