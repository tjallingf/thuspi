const Controller = require('@/controllers/Controller');
const { globSync } = require('glob');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const Extension = require('@/models/extensions/Extension');
const ExtensionNotInstalledError = require('@/errors/ExtensionNotInstalledError');

class ExtensionController extends Controller {
    // static get FileExtensionsWhiteList() { return ['json', 'js', 'py']; };

    /**
     * Loads the modules of all extensions.
     * @returns {Promise}
     */
    static async load() {
        return Promise.all(this.index().map(ext => ext.init()))
    }

    /**
     * Gets a list of all enabled extensions.
     * @returns {array}
     */
    static _populate() {
        const manifestFilepaths = globSync('*/manifest.json', { cwd: EXTENSIONS_DIR, absolute: true });

        // Create an object of extensions
        return Object.fromEntries(_.map(manifestFilepaths, filepath => {
            // Get the id of the extension from the manifest's filepath
            const extId = path.basename(path.dirname(filepath));

            // Read the contents of the manifest file
            const content = fs.readFileSync(filepath, 'utf8');
            const manifest = JSON.parse(content);

            const extension = new Extension(extId, manifest);

            return [ extId, extension ];
        }))
    }

    /**
     * Calls the callback for all extensions that have the given file.
     * @param {Array|string} assetId The id of the asset.
     * @param {Function} callback The callback to apply for each extension. 
     * @returns {Array}
     */
    static mapAssets(assetId, callback) {
        const extensions = this.indexBy(ext => ext.hasAsset(assetId));
        
        return _.map(extensions, ext => {
            const asset = ext.getAsset(assetId);
            return callback?.apply(null, [ asset, ext ]);
        })
    }
    
    /**
     * Finds an extension by id.
     * @param {string} id - The id of the extension to find.
     * @throws {ExtensionNotInstalledError} - If the extension is not installed.
     * @returns {Extension} The extension.
     */
    static find(id) {
        const extension = super.find(id);

        if(extension instanceof Extension) 
            return extension;

        throw new ExtensionNotInstalledError(id);
    }

    static findModule(typeName, id) {
        if(!typeof id == 'string' || !id.includes('/'))
            return null;
        
        const [ extId, moduleId ] = id.split('/');
        const ext = this.find(extId);
        return ext.getModule(typeName, moduleId);
    }

    // /**
    //  * Creates and stores a list of extensions.
    //  * @returns {ExtensionController}
    //  */
    // static _populate() {
    //     // Get a list of extension ids
    //     const extensionIds = globSync('*/manifest.json', { cwd: EXTENSIONS_DIR })
    //         .map(manifestFilepath => path.dirname(manifestFilepath));
        
    //     return Object.fromEntries(extensionIds.map(extensionId => {
    //         const manifestLock = this.generateManifestLock(extensionId);
    //         return [ extensionId, manifestLock]
    //     }));
    // }

    // /**
    //  * Reads the manifest file of an extension.
    //  * @param {string} extensionId The id of the extension to read the manifest file of.
    //  * @returns {object} The contents of the manifest file.
    //  */
    // static readManifest(extensionId) {  
    //     const filepath = path.join(this.getDir(extensionId), 'manifest.json'); 
    //     return JSON.parse(fs.readFileSync(filepath, 'utf8'));
    // }

    // /**
    //  * Reads the manifest lockfile of an extension.
    //  * @param {string} extensionId The id of the extension to read the manifest lockfile of.
    //  * @returns {object} The contents of the manifest lockfile.
    //  */
    // static readManifestLock(extensionId) {  
    //     const filepath = path.join(this.getDir(extensionId), 'manifest-lock.json'); 
    //     return JSON.parse(fs.readFileSync(filepath, 'utf8'));
    // }
    
    // /**
    //  * Generates a manifest lockfile for an extension.
    //  * @param {string} extensionId The id of the extension to generate the manifest lockfile for.
    //  * @param {number} lockfileVersion The version of the lockfile to generate.
    //  * @returns {object} The contents of the manifest lockfile.
    //  */
    // static generateManifestLock(extensionId, lockfileVersion = 1) {
    //     // Path to store the manifest lock file at
    //     const filepath = path.join(this.getDir(extensionId), 'manifest-lock.json');

    //     // Pattern for getting a list of modules
    //     const pattern = `**/*.{${this.FileExtensionsWhiteList.join(',')}}`;

    //     // Get a list of modules
    //     const modules = globSync(pattern, { cwd: this.getModulesDir(extensionId) });

    //     // Contents of the manifest
    //     const manifest = this.readManifest(extensionId);
        
    //     // Variable for storing the data to write to the manifest lockfile
    //     let data = { lockfileVersion: lockfileVersion };

    //     switch(lockfileVersion) {
    //         case 1:
    //             data = _.pick(manifest, 'name', 'author');
    //             data.modules = {};
                
    //             modules.forEach(filepath => {
    //                 const parsed = path.parse(filepath);

    //                 // Files and directories can be disabled by prepending them with a `_`.
    //                 // Disabled files should not be included in the manifest lock file.
    //                 const isDisabled = (parsed.name.startsWith('_') || /\\_|\/_/gm.test(parsed.dir));
    //                 if(isDisabled) return true;

    //                 // Filename with directories appended, but without extension
    //                 const nameWithDirs = path.join(parsed.dir, parsed.name).replace(/[\\\/]+/gm, '/');

    //                 // The keypath for in the manifest-lock.json file
    //                 // (removing any _) from the start of the file.
    //                 const keypath = _.trimStart(nameWithDirs, '_').replaceAll('/', '.modules.');

    //                 _.set(data.modules, keypath, {
    //                     path: path.join(this.getModulesDir(extensionId), filepath),
    //                     type: _.trimStart(parsed.ext, '.'),
    //                     name: nameWithDirs
    //                 });
    //             })

    //             break;
    //         default:
    //             throw new Error(`Unknown manifest lockfile version: '${lockfileVersion}'.`)
    //     }

    //     fs.writeFileSync(filepath, JSON.stringify(data), 'utf8');

    //     return data;
    // }

    // /**
    //  * Finds the root directory for an extension.
    //  * @param {string} extensionId The id of the extension to find the root directory for.
    //  * @returns {string} The root directory path of the extension.
    //  */
    // static getDir(extensionId) {
    //     return path.join(EXTENSIONS_DIR, extensionId);
    // }

    // /**
    //  * Finds the modules/ directory for an extension
    //  * @param {string} extensionId The id of the extension to find the modules/ directory for.
    //  * @returns {string} The modules/ directory path of the extension
    //  */
    // static getModulesDir(extensionId) {
    //     return path.join(this.getDir(extensionId), 'modules'); }
}

module.exports = ExtensionController;