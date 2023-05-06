import _ from 'lodash';
import apiRoute from '@/server/apiRoute';
import { UserController, User } from '@/zylax/users';
import { Server } from '@/server/types';

export default (server: Server) => {
    server.get(
        '/api/users',
        apiRoute(User, async (route, req, res) => {
            await route.respondWithCollection(route.getCollection());
        }),
    );

    server.get(
        '/api/users/:id',
        apiRoute(User, async (route, req, res) => {
            route.setPermissionHandler((permission, user) => {
                if (req.user.id === user.id) return true;
                return req.user.hasPermission(permission);
            });

            const userId = req.params.id === 'me' ? req.user.id : req.params.id;
            await route.respondWithDocument(route.getDocument(userId));
        }),
    );
};
