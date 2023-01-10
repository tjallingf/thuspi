const Controller = require('@controllers/Controller');
const StorageController = require('@controllers/StorageController');
const _ = require('lodash');

class TokenController extends Controller {
    static index() {
        return StorageController.find('data/tokens');  
    }
}

module.exports = TokenController;