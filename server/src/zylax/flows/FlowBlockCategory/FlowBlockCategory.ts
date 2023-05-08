import type { Color } from '@/zylax/utils/colors';
import { ExtensionModule } from '../../extensions';

export interface FlowBlockCategoryManifest {
    color: Color | number;
}

export default class FlowBlockCategory extends ExtensionModule {
    getManifest(): FlowBlockCategoryManifest {
        return;
    }
}
