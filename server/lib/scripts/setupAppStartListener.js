const ExtensionController = require('@controllers/ExtensionController');

const main = () => {
    ExtensionController.mapAllWithItem('listeners/app_start', 
        (extension, itemName) => extension.executeItem(itemName));
}

module.exports = main;