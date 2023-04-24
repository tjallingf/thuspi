import api from '@/utils/express/middleware/api';
import { Language } from '@/zylax/localization';
import LanguageController from '@/zylax/localization/LanguageController';

export default (app) => {
    app.get('/api/languages/:id', api(Language, async (api, req) => {
        api.setPermissionChecker(() => true);
        await api.withResource(api.getResource(req.params.id));
    }))
}