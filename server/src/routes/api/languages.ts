import apiRoute from '@/server/apiRoute';
import { Server } from '@/server/types';
import { Language } from '@/zylax/localization';
import LanguageController from '@/zylax/localization/LanguageController';

export default (server: Server) => {
    server.get(
        '/api/languages/:id',
        apiRoute(Language, async (route, req) => {
            route.setPermissionHandler(() => true);
            await route.respondWithDocument(route.getDocument(req.params.id));
        }),
    );
};
