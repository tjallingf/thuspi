// Load global variables
require('./lib/utils/globals');

const expressApp = require('@/utils/expressApp');
const database = require('@/utils/database');
const ExtensionController = require('@/controllers/ExtensionController');
const ConfigController = require('@/controllers/ConfigController');
const DeviceController = require('@/controllers/DeviceController');

// Check if the server has root privileges
if(typeof process.getuid == 'function' && process.getuid() !== 0) {
    crit('The server must be started with root privileges.');
    process.exit();
}

// Force NODE_ENV to be either 'dev' or 'prod'
process.env.NODE_ENV = (process.env.NODE_ENV === 'dev' ? 'dev' : 'prod');

// Check whether the server is running in development or production
if(process.env.NODE_ENV === 'prod') {
    LOGGER.info(`Starting in production mode.`);
} else {
    LOGGER.info(`Starting in development mode.`);``
}

// Connect to database
database.connect(ConfigController.find('secret.database'));

(async () => {
    // Load extensions
    await ExtensionController.load();
    LOGGER.info(`Loaded ${ExtensionController.index().length} extensions.`);

    // Load devices
    await DeviceController.index();

    // Setup and start Express.js
    expressApp.start();
})();