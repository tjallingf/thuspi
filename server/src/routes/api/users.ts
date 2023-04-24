import _ from 'lodash';
import api from '@/utils/express/middleware/api';
import { UserController, User } from '@/zylax/users';

export default (app) => {
    app.get('/api/users', api(User, async (api, req) => {
        await api.withCollection(api.getCollection());
    }));

    app.get('/api/users/:id', api(User, async (api, req) => {
        api.setPermissionChecker((permission, user) => {
            if(req.user.id === user.id) return true;
            return req.user.hasPermission(permission);
        })

        const userId = req.params.id === 'me' ? req.user.id : req.params.id;
        await api.withResource(api.getResource(userId));
    }));
}