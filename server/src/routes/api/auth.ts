import { User } from '@/zylax/users';
import passport from 'passport';
import apiRoute from '@/server/apiRoute';
import { Server } from '@/types';

export default (server: Server) => {
    server.post(
        '/api/auth/login/',
        (req, res, next) => {
            passport.authenticate('local')(req, res, (...args: any[]) => {
                // console.log('1', args, req.user);
                next();
            })
        },
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
