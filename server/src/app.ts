import { Database, devices, Config, extensions, flows, logger, users, localization } from './zylax';
import fs from 'fs';
import path from 'path';
import { ROOT_DIR } from './zylax/constants';
import Flow from './zylax/flows/Flow';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DeviceController } from './zylax/devices';
import * as server from './server';

// Extend day.js
dayjs.extend(customParseFormat);

(async function () {
    // Check if the server has root privileges
    if (typeof process.getuid == 'function' && process.getuid() !== 0) {
        throw new Error('The server must be started with root privileges.');
    }

    // Force NODE_ENV to be either 'development' or 'production'
    process.env.NODE_ENV =
        process.env.NODE_ENV === 'development' || process.env.npm_lifecycle_script?.endsWith?.('.ts')
            ? 'development'
            : 'production';

    // Check whether the server is running in development or production
    logger.info(`Starting in ${process.env.NODE_ENV} mode.`);

    // Connect to the database
    Database.connect(Config.get('secret.database'));

    // Load all entities
    await users.UserController.load();
    await extensions.ExtensionController.load();
    localization.LocaleController.load();
    await devices.DeviceController.load();
    await flows.FlowController.load();

    server.start();
})();
