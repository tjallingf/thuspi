const Model = require('@models/Model');
const _ = require('lodash');
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const ManifestManager = require('@managers/ManifestManager');

const MODULES_FILE_EXTENSIONS = ['js', 'json'];

class ExtensionModel extends Model {
    manifest;
    manifestLock;

    constructor(id, manifest) {
        super(id, manifest);

        this.manifest = manifest;
        this.manifestLock = this.generateManifestLock(1);

        return this;
    }

    getBaseDir() {
        return path.join(DIRS.EXTENSIONS, this.id);
    }

    getModulesDir() {
        return path.join(this.getBaseDir(), 'modules');
    }

    generateManifestLock(lockfileVersion = 1) {
        // Path to store the manifest lock file at
        const filepath = path.join(this.getBaseDir(), 'manifest-lock.json');

        // Pattern for getting a list of modules
        const pattern = `**/*.{${MODULES_FILE_EXTENSIONS.join(',')}}`;

        // Get a list of modules
        const modules = glob.sync(pattern, { cwd: this.getModulesDir() });
        
        // Variable for storing the data to write to the manifest lockfile
        let data = { 
            ...this.manifest,
            lockfileVersion: lockfileVersion,
            modules: {}
        };

        switch(lockfileVersion) {
            case 1:              
                modules.forEach(filepath => {
                    const parsed = path.parse(filepath);

                    // Files and directories can be disabled by prepending them with a `_`.
                    // Disabled files should not be included in the manifest lock file.
                    const isDisabled = (parsed.name.startsWith('_') || /\\_|\/_/gm.test(parsed.dir));
                    if(isDisabled) return true;

                    // Filename with directories appended, but without extension
                    const nameWithDirs = path.join(parsed.dir, parsed.name).replace(/[\\\/]+/gm, '/');

                    // The keypath for in the manifest-lock.json file
                    // (removing any _) from the start of the file.
                    const keypath = _.trimStart(nameWithDirs, '_').replaceAll('/', '.items.');

                    _.set(data.modules, keypath, {
                        path: path.join(this.getModulesDir(), filepath),
                        type: _.trimStart(parsed.ext, '.'),
                        name: nameWithDirs
                    });
                })

                break;
            default:
                throw new Error(`Unknown manifest lockfile version: '${lockfileVersion}'.`)
        }

        fs.writeFileSync(filepath, JSON.stringify(data), 'utf8');

        return data;
    }

    /**
     * Takes an item name (i.e. 'connections/serial' or 'listeners'),
     * and converts it to a keypath (i.e. 'connections.items.serial')
     * 
     * @param {string} itemName - The item name to convert
     * @returns {string} 
     */
    itemNameToKeypath(itemName) {
        return _.trim(itemName, '/').replaceAll('/', '.items.');
    }

    /**
     * Takes an item name (i.e. 'listeners/app_start', and converts it to it's
     * respective path on the file system (i.e. '/home/pi/.../listeners/app_start.js').
     * If the item has any sub-items, it will return the path to the directory
     * name of the item, i.e. '/home/pi/.../connections/'
     * 
     * @param {string} itemName - The item name to convert
     * @returns {string} 
     */
    itemNameToFilepath(itemName) {
        if(!this.hasItem(itemName))
            throw new Error(`Extension '${this.id}' does not contain item '${itemName}'.`) ;

        const keypath = this.itemNameToKeypath(itemName);

        return _.get(this.manifestLock.modules, keypath).path;
    }

    /**
     * Takes an item name (i.e. 'connections/serial' or 'listeners'),
     * and returns an array of sub-items of that item.
     * 
     * @param {string} parentItemName - The parent item to look in.
     * @returns {array} An array of items that are enabled.
     */
    listItems(parentItemName, onlyListEnabledItems = true) {
        if(!this.hasItem(itemName))
            return [];
        
        // Get an object of items { parentItemName: enabledState }
        const itemsWithEnabledState = this.getItem(parentItemName);
        
        if(onlyListEnabledItems)
            return Object.keys(_.pickBy(itemsWithEnabledState, (parentItemName, enabledState) => enabledState));
        
        return Object.keys(itemsWithEnabledState);
    }
    
    mapChildren(parentItemName, callback) {
        const keypath = parentItemName ? `modules.${parentItemName}` : 'modules';
        const items = _.get(this.manifestLock, keypath);

        return _.cloneDeepWith(items, (item, key) => {
            // Only call the callback on items that don't have children.
            if(typeof item?.name == 'undefined') return;

            return callback.apply(null, [item, item.name]);
        });
    }

    getCacheFilepath(cacheName) {
        const snakedCacheName = _.snakeCase(cacheName);
        return path.join(DIRS.STORAGE, `cache/extensions/${this.id}/${snakedCacheName}.json`);
    }

    writeCache(cacheName, keypath = '', data) {
        const cache = this.readCache(cacheName);
        const newCache = _.set(cache, keypath, data);

        const filepath = this.getCacheFilepath(cacheName);

        // Create directory if it doesn't exist
        if(!fs.existsSync(path.dirname(filepath)))
            fs.mkdirSync(path.dirname(filepath), { recursive: true });

        // Write the cache to the file
        fs.writeFileSync(filepath, JSON.stringify(newCache), 'utf8');

        return this;
    }

    readCache(cacheName, keypath = '') {
        try {
            const cache = JSON.parse(fs.readFileSync(this.getCacheFilepath(cacheName), 'utf8'));
            return keypath ? _.get(cache, keypath) : cache;
        } catch(err) {
            return {};
        }
    }

    /**
     * Check whether the extension has an item.
     * 
     * @param {string} itemName - The item name to look for
     * @returns {boolean} - Whether the extension has that item or not.
     */
    hasItem(itemName) {
        const item = this.getItem(itemName);
        return (!!(item?.path || item?.items));
    }

    getItem(itemName) {
        const keypath = this.itemNameToKeypath(itemName);

        return _.get(this.manifestLock.modules, keypath) || {};
    }

    validate() {}

    readItemManifest(itemName, options) {
        const data = this.readItem(itemName+'/manifest', options);
        return new ManifestManager(typeof data == 'object' ? data : {});  
    }

    readItem(itemName, { allowScripts = false, scriptArgs = [] } = {}) {
        const filepath = this.itemNameToFilepath(itemName);
        const fileExt = path.parse(filepath).ext;
           
        const contents = fs.readFileSync(filepath, 'utf8');

        switch(fileExt) {
            case '.json':
                return JSON.parse(contents);
            case '.js':
                if(!allowScripts) return contents;
                return this.executeItemSync(itemName, scriptArgs)?.data;
            default:
                return contents;
        }
    }

    requireItem(itemName) {
        const id = path.join(DIRS.EXTENSIONS, this.id, 'lib', itemName);
        return require(id);
    }

    executeItemSync(itemName, args = []) {
        const filepath = this.itemNameToFilepath(itemName);
        const ext = path.parse(filepath).ext;
        
        const defaultArgs = { extension: this, extensionId: this.id, itemName: itemName };

        args = _.merge([defaultArgs], args);

        switch(ext) {
            case '.js':
                const mainFunc = require(filepath);

                if(typeof mainFunc != 'function')
                    throw new Error(`No function was directly exported from file '${filepath}'.`);
            
                const result = mainFunc.apply(null, args);
                return { data: result };
            default:
                throw new Error(`Item '${itemName}' has an invalid file extension: '${ext}'. Expected '.js'.`);
        }
    }
    
    async executeItem(itemName, args = []) {
        return new Promise(async (resolve, reject) => {
            try {
                const { data } = this.executeItemSync(itemName, args);
                return resolve({ data: await data });
            } catch(err) {
                return reject(err);
            }
        })
    }
}

module.exports = ExtensionModel;