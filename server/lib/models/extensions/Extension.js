const Model = require('@/models/Model');
const _ = require('lodash');
const path = require('path');
const { globSync } = require('glob');
const ExtensionModule = require('@/models/extensions/ExtensionModule');
const ExtensionAsset = require('@/models/extensions/ExtensionAsset');
const fs = require('fs');
const ExtensionModuleNotFoundError = require('@/errors/ExtensionModuleNotFoundError');
const ExtensionAssetNotFoundError = require('@/errors/ExtensionAssetNotFoundError');

const GLOB_PATTERN_MODULES = 'modules/**/*/index.js';
const GLOB_PATTERN_ASSETS  = [
    'assets/language/*.json'
];

class Extension extends Model {
    lock;
    dir;
    modules = {};
    assets = {};

    /** @type {Promise<any>[]} */
    #requiringModules = [];

    constructor(id, manifest) {
        super(id, manifest);

        this.dir = path.join(EXTENSIONS_DIR, id);

        return this;
    }
        
    init() {
        this.assets = this.#loadAssets();

        this.#requireModules();
    }

    /**
     * Finds an asset.
     * @param {Array|string} id - The id (i.e. 'language/en-us') of the asset to find.
     * @returns {ExtensionAsset} - The asset.
     */
    getAsset(id, throwOnFail = true) {
        if(_.isArray(id)) id = id.join('/');

        // Check if the asset exists
        if(!this.assets[id]) {
            if(throwOnFail)
                throw new ExtensionAssetNotFoundError(this, id);
            return null;
        }
        
        // Return the asset
        return this.assets[id];
    }

    /**
     * Checks whether the extension has a given asset.
     * @param {Array|string} id - The id (i.e. 'language/en-us') of the asset to find.
     * @returns {boolean} - Whether the extension has the asset.
     */
    hasAsset(id) {
        return !!this.getAsset(id, false);
    }

    getModule(typeName, id, throwOnFail = true) {
        // Check if the module exists
        if(!this.modules[typeName] || !this.modules[typeName][id]) {
            if(throwOnFail)
                throw new ExtensionModuleNotFoundError(this, typeName, id);
            return null;
        }
        
        // Return the module
        return this.modules[typeName][id];
    }

    /**
     * Checks whether the extension has a given model.
     * @param {string} typeName - The type of module to find.
     * @param {string} id - The id of the module to find.
     * @returns {boolean} - Whether the extension has the module.
     */
    hasModule(typeName, id) {
        return !!this.getModule(typeName, id, false);
    }

    /**
     * Registers an extension module.
     * @param {ExtensionModule} module - The extension module.
     * @returns {void}
     */
    registerModule(module) {
        if(!this.#requiringModules[module.filepath])
            throw new Error(`Cannot register module ${module} when it is not loaded.`);

        if(!this.modules[module.type.name]) this.modules[module.type.name] = {};
        this.modules[module.type.name][module.id] = module;

        // Resolve the promise
        this.#requiringModules[module.filepath].promise.resolve();
    }

    /**
     * Loads all assets found in the extension.
     * @returns {Object}
     */
    #loadAssets() {
        const filepaths = globSync(GLOB_PATTERN_ASSETS, { cwd: this.dir, absolute: true });

        const assets = {};
        filepaths.forEach(filepath => {
            const asset = new ExtensionAsset(filepath);
            assets[asset.id] = asset;
        })

        return assets;
    }

    /**
     * Requires all modules found in the extension.
     * @returns {Promise}
     */
    #requireModules() {
        const filepaths = globSync(GLOB_PATTERN_MODULES, { cwd: this.dir, absolute: true });

        return Promise.all(_.map(filepaths, filepath => {
            return new Promise((resolve, reject) => {
                // Store the promise so it can be used inside registerModule().
                this.#requiringModules[filepath] = { 
                    promise: { resolve, reject } 
                };
                
                require(filepath);
            })
        }))
    }

    //   mapChildren(parentModuleName, callback) {
    //     const keypath = parentModuleName ? `modules.${parentModuleName}` : 'modules';
    //     const modules = _.get(this.propsLock, keypath);

    //     return _.cloneDeepWith(modules, (item, key) => {
    //         // Only call the callback on modules that don't have children.
    //         if(typeof module?.name == 'undefined') return;

    //         return callback.apply(null, [item, module.name]);
    //     });
    // }

    // getCacheFilepath(cacheName) {
    //     const snakedCacheName = _.snakeCase(cacheName);
    //     return path.join(STORAGE_DIR, `cache/extensions/${this.id}/${snakedCacheName}.json`);
    // }

    // writeCache(cacheName, keypath = '', data) {
    //     const cache = this.readCache(cacheName);
    //     const newCache = _.set(cache, keypath, data);

    //     const filepath = this.getCacheFilepath(cacheName);

    //     // Create directory if it doesn't exist
    //     if(!fs.existsSync(path.dirname(filepath)))
    //         fs.mkdirSync(path.dirname(filepath), { recursive: true });

    //     // Write the cache to the file
    //     fs.writeFileSync(filepath, JSON.stringify(newCache), 'utf8');

    //     return this;
    // }

    // readCache(cacheName, keypath = '') {
    //     try {
    //         const cache = JSON.parse(fs.readFileSync(this.getCacheFilepath(cacheName), 'utf8'));
    //         return keypath ? _.get(cache, keypath) : cache;
    //     } catch(err) {
    //         return {};
    //     }
    // }
}

module.exports = Extension;