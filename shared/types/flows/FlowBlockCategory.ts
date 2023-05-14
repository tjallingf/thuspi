import type { Color } from '../utils/colors';

export interface FlowBlockCategoryManifest {
    color: Color | number;
}

export interface FlowBlockCategoryManifestSerialized {
    color: string | number;
}