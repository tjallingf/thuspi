// Override the require() function
require('module-alias/register');

const { uuid } = require('@lib/helpers');
const path = require('path');
const LogManager = require('@managers/LogManager');

// Set some directory constants
const ROOT = path.resolve(__dirname, '../');

globalThis.DIRS = {
    ROOT: ROOT,
    LIB: path.join(ROOT, 'lib'),
    CONFIG: path.join(ROOT, 'config'),
    ROUTES: path.join(ROOT, 'lib', 'routes'),
    STORAGE: path.join(ROOT, 'storage'),
    TMP: path.join(ROOT, 'storage', 'tmp'),
    EXTENSIONS: path.join(ROOT, 'storage', 'extensions'),
    SCRIPTS: path.join(ROOT, 'lib', 'scripts'),
    STATIC: path.join(ROOT, 'storage', 'static'),
    LOG: path.join(ROOT, 'storage', 'log')
}

globalThis.Log = new LogManager();
