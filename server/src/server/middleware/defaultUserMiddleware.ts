import { User, UserController } from '@/zylax/users';
import { RequestHandler } from 'express';
import { Config } from '@/zylax';

// Set 'req.user' to the default user if the
// request is made by an unauthenticated user.
const defaultUserMiddleware = async (req, res, next) => {
    if (!(req.user instanceof User)) {
        req.user = UserController.findBy('username', Config.get('system.users.defaultUser'));
    }

    next();
};

export default defaultUserMiddleware;
