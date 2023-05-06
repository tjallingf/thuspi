import Flow from './Flow';
import { FlowBlockEvent } from './FlowBlockEvent';
import FlowBlockManifest from './FlowBlockManifest';

export interface FlowBlockParameterEvent extends FlowBlockEvent {
    value: any;
}
