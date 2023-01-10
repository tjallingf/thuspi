const UserController = require('@controllers/UserController');
const UserModel = require('@models/UserModel');

const userMiddleware = (req, res, next) => {
    if(!(req.user instanceof UserModel)) {
        req.user = UserController.find('default');
    }

    next();
}

module.exports = userMiddleware;