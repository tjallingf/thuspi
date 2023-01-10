const Controller = require('@controllers/Controller');
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const ExtensionModel = require('@models/ExtensionModel');

class ExtensionController extends Controller {
    // static get FileExtensionsWhiteList() { return ['json', 'js', 'py']; };

    /**
     * Gets a list of all enabled extensions.
     * @returns {array}
     */
    static populate() {
        const extManifests = glob.sync('*/manifest.json', { cwd: DIRS.EXTENSIONS });

        // Create object of extensions, like { extId: extManifest }
        return Object.fromEntries(_.map(extManifests, filepath => {
            // Get the id of the extension from the manifest's filepath
            const id = path.dirname(filepath);

            // Read the contents of the manifest file
            const content = fs.readFileSync(path.join(DIRS.EXTENSIONS, filepath), 'utf8');
            const manifest = JSON.parse(content);

            const extension = new ExtensionModel(id, manifest);

            return [ id, extension ];
        }))
    }

     /**
     * Gets a list of extensions that have a specific item.
     * @param {string} itemName The item the extension has to have (i.e. 'listeners/app_start').
     * @returns {ExtensionModel[]} Array of extensions that have the item in question.
     */
    static findAllWithItem(itemName) {
        return Object.values(this.index()).filter(extension => {
            return extension.hasItem(itemName);
        });
    }

    /**
     * Applies the callback for all extensions that have the given item
     * @param {string} itemName The item the extension has to have (i.e. 'listeners/app_start').
     * @param {mapWithItem_callback} callback The callback to apply for each extension. 
     * @returns 
     */
    static mapAllWithItem(itemName, callback) {
        const extensions = this.findAllWithItem(itemName);

        return _.map(extensions, extension => 
            callback.apply(null, [extension, itemName]));
    }

    // /**
    //  * Creates and stores a list of extensions.
    //  * @returns {ExtensionController}
    //  */
    // static populate() {
    //     // Get a list of extension ids
    //     const extensionIds = glob.sync('*/manifest.json', { cwd: DIRS.EXTENSIONS })
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
    //     const modules = glob.sync(pattern, { cwd: this.getModulesDir(extensionId) });

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
    //                 const keypath = _.trimStart(nameWithDirs, '_').replaceAll('/', '.items.');

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
    //     return path.join(DIRS.EXTENSIONS, extensionId);
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