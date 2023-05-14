import { ExtensionModule } from '../../extensions';
import { FlowBlockManifest } from '~shared/types/flows/FlowBlock';

export default class FlowBlock extends ExtensionModule {
    constructor() {
        super();
    }

    run(args: any): any {
        return false;
    }

    getManifest(): FlowBlockManifest {
        return {
            category: ''
        };
    }
}
