const ControllerAsync = require('@/controllers/ControllerAsync');
const ConfigController = require('@/controllers/ConfigController');
const Database = require('@/utils/database');
const UserModel = require('@/models/User');
const _ = require('lodash');

class UserController extends ControllerAsync {
    /**
     * Creates and stores an object of users.
     */
    static async _populate() {
        const rows = await Database.query('SELECT * FROM `users`');
        const defaultUser = ConfigController.find('default-user');
        rows.push({ ...defaultUser, id: 'default' });
        
        return this._mapModel(rows, UserModel);
    }

    static async findByUsername(username) {
        return _.find(await this.index(), u => u.getProp('username') == username);
    }
}

module.exports = UserController;