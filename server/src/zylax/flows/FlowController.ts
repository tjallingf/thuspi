import ControllerDatabase from '../lib/DatabaseController';
import Flow from './Flow';

export default class FlowController extends ControllerDatabase<Flow>() {
    static table = 'flows';

    static load() {
        return super.load(Flow);
    }
}
