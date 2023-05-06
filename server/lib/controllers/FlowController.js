const Controller = require('@/controllers/Controller');
const ConfigController = require('@/controllers/ConfigController');
const Flow = require('@/models/flows/Flow');
const _ = require('lodash');

class FlowController extends Controller {
    /**
     * Creates and stores an object of flows.
     */
    static _populate() {
        return _.mapValues(ConfigController.find('flows'), (props, id) => 
            new Flow(id, props));
    }
}

module.exports = FlowController;