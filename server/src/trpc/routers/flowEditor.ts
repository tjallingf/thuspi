import { router, publicProcedure } from '../trpc';
import Device from '../../zylax/devices/Device';
import { type GetSerializedProps } from '../../types';
import { FlowBlock } from '@/zylax/flows';
import { ExtensionController } from '@/zylax/extensions';
import { logger } from '@/zylax';
import { type FlowBlockManifest } from '@/zylax/flows';

export const flowEditorRouter = router({
    listBlocks: publicProcedure
        .query(async ({ ctx }): Promise<GetSerializedProps<Device>[]> => {
            const flowBlocks = ExtensionController.findAllModulesOfType(FlowBlock);

            const result: Array<{ type: string; manifest: FlowBlockManifest }> = [];

            _.forOwn(flowBlocks, (moduleClass, moduleSlug) => {
                try {
                    result.push({
                        type: moduleSlug,
                        manifest: moduleClass.prototype.getManifest(),
                    });
                } catch (err: any) {
                    logger.warn(err);
                    return true;
                }
            });

            return await ctx.getCollection(Device, (d) => {
                return ctx.user.hasPermission(`devices.read.${d.getId()}`);
            });
        }),
})