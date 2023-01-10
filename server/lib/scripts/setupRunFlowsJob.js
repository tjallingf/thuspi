const ConfigController = require('@controllers/ConfigController');
const ExtensionController = require('@controllers/ExtensionController');

const main = () => {
    const loop = () => {
        console.log('Running flows...');
        ExtensionController.mapAllWithItem('listeners/run_flows',
            (extension, itemName) => extension.executeItem(itemName))
    }

    // Number of milliseconds between the start of each run
    const interval = parseInt(ConfigController.find('system.flows.runAtInterval')) * 1000;

    // Run flows in a loop
    loop();
    setInterval(loop, interval);
}

module.exports = main;