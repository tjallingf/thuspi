const ControllerAsync = require('@/controllers/ControllerAsync');
const Device = require('@/models/devices/Device');
const Database = require('@/utils/database');
const _ = require('lodash');

class DeviceController extends ControllerAsync {
    static doExcludeInvalid = true;

    static async _populate() {
        const rows = await Database.query("SELECT * FROM `devices` WHERE `driver` LIKE '%somfy%'");
        return this._mapModel(rows, Device);
    }

    static update(id, props) {
        const fields = _.omit(props, 'id');
        const fieldsStr = Database.escape(fields);
        Database.query('UPDATE `devices` SET '+fieldsStr+' WHERE `id` = ?', [ id ]);
    }
}

module.exports = DeviceController;