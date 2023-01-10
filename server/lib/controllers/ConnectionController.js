const ExtensionModel = require('@models/ExtensionModel');
const Controller = require('@controllers/Controller');

class ConnectionController extends Controller {
    /**
     * 
     * @param {string} type 
     * @param {object} options 
     * @returns {ConnectionModel}
     */
    static find(type, options) {
        const [ extensionId, itemId ] = type.split('/');
        const extension = new ExtensionModel(extensionId);

        const manifest = extension.readItemManifest(`connections/${itemId}`);
        const controllerItemName = manifest.get('controller');
        const controller = extension.requireItem(controllerItemName);
        
        return controller.find(options);
    }
}

module.exports = ConnectionController;