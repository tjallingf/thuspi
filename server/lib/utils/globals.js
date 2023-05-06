// Override the require() function
require('module-alias/register');

const logger = require('@/logger');
const path = require('path');
const ExtensionFramework = require('@/models/extensions/framework/ExtensionFramework');

// Make logger globally available
globalThis.LOGGER = logger;

// Set some directory constants
globalThis.ROOT_DIR       = path.resolve(__dirname, '../../');
globalThis.CONFIG_DIR     = path.join(ROOT_DIR, 'config');
globalThis.ROUTES_DIR     = path.join(ROOT_DIR, 'lib', 'routes');
globalThis.STORAGE_DIR    = path.join(ROOT_DIR, 'storage');
globalThis.TMP_DIR        = path.join(ROOT_DIR, 'storage', 'tmp');
globalThis.EXTENSIONS_DIR = path.join(ROOT_DIR, 'storage', 'extensions');
globalThis.STATIC_DIR     = path.join(ROOT_DIR, 'storage', 'static');
globalThis.LOG_DIR        = path.join(ROOT_DIR, 'storage', 'log');

// For use inside extension module index files
globalThis.extension = () => new ExtensionFramework();