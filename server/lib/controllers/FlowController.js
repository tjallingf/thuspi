const Controller = require('@controllers/Controller');
const ConfigController = require('@controllers/ConfigController');
const FlowModel = require('@models/FlowModel');
const _ = require('lodash');

class FlowController extends Controller {
    /**
     * Creates and stores an object of flows.
     */
    static populate() {
        return _.mapValues(ConfigController.find('flows'), (props, id) => 
            new FlowModel(id, props));
    }
}

module.exports = FlowController;