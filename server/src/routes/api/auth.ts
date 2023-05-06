import { User } from '@/zylax/users';
import passport from 'passport';
import apiRoute from '@/server/apiRoute';
import { Server } from '@/server/types';

export default (server: Server) => {
    server.post(
        '/api/auth/login/',
        passport.authenticate('local'),
        apiRoute(User, async (route, req) => {
            route.setPermissionHandler(() => true);
            await route.respondWithDocument(req.user);
        }),
    );

    // app.get('/api/auth/logout/', (req, res, next) => {
    //     req.logout(async err => {
    //         if (err) { return next(err); }
    //         return res.send({ user: (await users.UserController.find('default')).getSafeProps() });
    //     });
    // })
};
