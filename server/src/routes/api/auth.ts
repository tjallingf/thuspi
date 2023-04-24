import { Request } from '@/utils/express/types';
import { User } from '@/zylax/users';
import passport from 'passport';
import api from '@/utils/express/middleware/api';
import { Response } from 'express';

export default (app) => {
    app.post('/api/auth/login/', passport.authenticate('local'), api(User, async (api, req) => {
        api.setPermissionChecker(() => true);
        await api.withResource(req.user);
    }))

    // app.get('/api/auth/logout/', (req, res, next) => {
    //     req.logout(async err => {
    //         if (err) { return next(err); }
    //         return res.send({ user: (await users.UserController.find('default')).getSafeProps() });
    //     });
    // })
}