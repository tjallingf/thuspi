const UserController = require('@/controllers/UserController');
const UserModel = require('@/models/User');

const userMiddleware = async(req, res, next) => {
    let userId = req.user || 'default';

    let user = await UserController.find(userId);
    if(!(user instanceof UserModel) && userId != 'default')
        user = await UserController.find('default');

    req.user = user;
    next();
}

module.exports = userMiddleware;