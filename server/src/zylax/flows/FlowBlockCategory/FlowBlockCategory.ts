import { ExtensionModule } from '../../extensions';
import { FlowBlockCategoryManifest } from '~shared/types/flows/FlowBlockCategory';
import colors from '@/zylax/utils/colors';

export default class FlowBlockCategory extends ExtensionModule {
    getManifest(): FlowBlockCategoryManifest {
        return {
            color: colors.BLUE
        };
    }
}
