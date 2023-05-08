import apiRoute from '@/server/apiRoute';
import { logger } from '@/zylax';
import { ExtensionController, Extension } from '@/zylax/extensions';
import { FlowBlock, FlowBlockCategory, FlowBlockCategoryManifest, FlowBlockManifest } from '@/zylax/flows';
import Flow from '@/zylax/flows/Flow';
import { Express } from 'express';
import _ from 'lodash';

export default (server: Express) => {
    server.get(
        '/api/flows',
        apiRoute(Flow, async (route, req) => {
            await route.respondWithCollection(route.getCollection());
        }),
    );

    server.get(
        '/api/flows/:id',
        apiRoute(Flow, async (route, req) => {
            await route.respondWithDocument(route.getDocument(req.params.id));
        }),
    );

    server.get(
        '/api/flows/editor/blocks',
        apiRoute(null, async (route, req) => {
            const flowBlocks = ExtensionController.findAllModulesOfType(FlowBlock);

            const result: Array<{ type: string; manifest: FlowBlockManifest }> = [];

            _.forOwn(flowBlocks, (moduleClass, moduleSlug) => {
                try {
                    result.push({
                        type: moduleSlug,
                        manifest: moduleClass.prototype.getManifest(),
                    });
                } catch (err: any) {
                    logger.error(err);
                    return true;
                }
            });

            route.respondWith(result);
        }),
    );

    server.get(
        '/api/flows/editor/block-categories',
        apiRoute(null, async (route, req) => {
            const flowBlockCategories = ExtensionController.findAllModulesOfType(FlowBlockCategory);
            const result: any[] = [];

            _.forOwn(flowBlockCategories, (moduleClass, moduleSlug) => {
                const parsedModuleSlug = Extension.parseModuleSlug(moduleSlug);
                try {
                    result.push({
                        id: parsedModuleSlug.moduleName,
                        manifest: moduleClass.prototype.getManifest(),
                        extensionId: parsedModuleSlug.extensionId,
                    });
                } catch (err: any) {
                    logger.error(err);
                    return true;
                }
            });

            route.respondWith(result);
        }),
    );
};
