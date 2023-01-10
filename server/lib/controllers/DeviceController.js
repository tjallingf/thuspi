const Controller = require('@controllers/Controller');
const DeviceModel = require('@models/DeviceModel');
const ConfigController = require('@controllers/ConfigController');
const _ = require('lodash');

class DeviceController extends Controller {
    static populate() {
        return _.mapValues(ConfigController.find('devices'), (props, id) => 
            new DeviceModel(id, props, this));
    }

    static indexForDriverType(driverType) {
        return _.pickBy(this.index(), d => d.getProp('driver.type') == driverType);
    }

    static indexForConnectionType(connectionType) {
        return _.pickBy(this.index(), d => d.getProp('connection.type') == connectionType);
    }

    static handleUpdate(id) {
        ConfigController.updateById('devices', id, this.find(id).getProps());
    }
}

module.exports = DeviceController;