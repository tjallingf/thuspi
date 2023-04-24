import { users } from '@/zylax';

export default async(req, res, next) => {
    if(!req.user) {
        req.user = users.UserController.findBy('username', users.UserController.DEFAULT_USER_USERNAME);
    }

    next();
}