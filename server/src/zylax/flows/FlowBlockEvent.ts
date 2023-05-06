import FlowBlockManifest from './FlowBlockManifest';

export interface FlowBlockEvent {
    block: {
        arguments: {
            [name: string]: any;
        };
        update: (manifest: FlowBlockManifest) => void;
    };
}
