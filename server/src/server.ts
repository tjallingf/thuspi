import { Database, devices, Config, extensions, flows, logger, users, localization } from './zylax';
import ExpressApp from './utils/express/ExpressApp';
import fs from 'fs';
import path from 'path';
import { ROOT_DIR } from './zylax/constants';
import Flow from './zylax/flows/Flow';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DeviceController } from './zylax/devices';

// Extend day.js
dayjs.extend(customParseFormat);

(async function() {
    
    // Check if the server has root privileges
    if(typeof process.getuid == 'function' && process.getuid() !== 0) {
        throw new Error('The server must be started with root privileges.');
    }

    // Force NODE_ENV to be either 'development' or 'production'
    process.env.NODE_ENV = (process.env.NODE_ENV === 'development' || process.env.npm_lifecycle_script?.endsWith?.('.ts'))
        ? 'development' 
        : 'production';

    // Check whether the server is running in development or production
    logger.info(`Starting in ${process.env.NODE_ENV} mode.`);

    // Connect to the database
    Database.connect(Config.get('secret.database'));

    (async () => {
        // Load users
        await users.UserController.load();

        // Load extensions
        await extensions.ExtensionController.load();

        // Load languages
        localization.LocaleController.load();

        // Load devices
        await devices.DeviceController.load();

        // Load flows
        await flows.FlowController.load();

        ExpressApp.setup();
        ExpressApp.listen();
    })();
})();