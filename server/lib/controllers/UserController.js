const Controller = require('@controllers/Controller');
const ConfigController = require('@controllers/ConfigController');
const UserModel = require('@models/UserModel');
const _ = require('lodash');

class UserController extends Controller {
    /**
     * Creates and stores an object of users.
     */
    static populate() {
        return _.mapValues(ConfigController.find('users'), (props, id) => 
            new UserModel(id, props, this));
    }

    static findByUsername(username) {
        return _.find(this.index(), u => u.getProp('username') == username);
    }

    static update(id, newProps) {
        ConfigController.updateById('users', id, newProps);
    }
}

module.exports = UserController;