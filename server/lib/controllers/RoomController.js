const ControllerAsync = require('@/controllers/ControllerAsync');
const database = require('@/utils/database');
const _ = require('lodash');
const Room = require('@/models/rooms/Room');

class RoomController extends ControllerAsync {
    static async _populate() {
        const rows = await database.query('SELECT * FROM `rooms`');
        return this._mapModel(rows, Room);
    }
}

module.exports = RoomController;