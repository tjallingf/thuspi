import { ExtensionModule } from '../../extensions';
import FlowBlockManifest from '../FlowBlockManifest';
import * as constants from './constants';
import { logger } from '@/zylax/lib';

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
