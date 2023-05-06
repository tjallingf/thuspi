import path from 'path';
import fs from 'fs';

const serverRoot = path.dirname(path.dirname(path.dirname(__filename)));

// Directory constants
export const ROOT_DIR       = fs.realpathSync(serverRoot);
export const CONFIG_DIR     = fs.realpathSync(path.join(ROOT_DIR, 'config'));
export const STORAGE_DIR    = fs.realpathSync(path.join(ROOT_DIR, 'storage'));
export const EXTENSIONS_DIR = fs.realpathSync(path.join(ROOT_DIR, 'storage', 'extensions'));
export const STATIC_DIR     = fs.realpathSync(path.join(ROOT_DIR, 'storage', 'static'));
export const LOG_DIR        = fs.realpathSync(path.join(ROOT_DIR, 'storage', 'log'));