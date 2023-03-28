const Model = require('@/models/Model');
const path = require('path');
const fs = require('fs');
const Manifest = require('@/models/Manifest');
const ExtensionModuleInstance = require('@/models/extensions/ExtensionModuleInstance');

class ExtensionModule extends Model {
    /** @type {string} */
    filepath;

    /** @type {Object} */
    #blueprint;

    /** @type {Object} */
    #instance;

    /** @type {Object} */
    type;
    
    /** @type {Manifest|null} */
    manifest = null;

    /**
     * 
     * @param {string} filepath - The filepath to the index.js file of the module.
     * @param {Object} blueprint - The blueprint class as declared in the index.js file of the module.
     * @param {Object} type - The type of module.
     */
    constructor(filepath, blueprint, type) {
        const id = path.basename(path.dirname(filepath));
        super(id);

        this.#blueprint = blueprint;
        this.filepath = filepath;
        this.type = type;
        this.manifest = this.readManifest();

        this.checkValidity(); 
    }

    /**
     * Creates a new instance of the blueprint.
     * @param {Array} args - The arguments to pass to the constructor.
     * @returns {ExtensionModuleInstance}
     */
    init(args = []) {
        return new ExtensionModuleInstance(this.#blueprint, args);
    }

    /**
     * Reads the manifest of the module.
     * @returns {Manifest|null}
     */
    readManifest() {
        // Get the filepath to the manifest
        const manifestFilepath = path.resolve(this.filepath, '../manifest.json');

        // Return if the file doesn't exist
        if(!fs.existsSync(manifestFilepath)) 
            return null;
        
        // Read and parse the file
        const contents = JSON.parse(fs.readFileSync(manifestFilepath));
        return new Manifest(contents);
    }

    _validate({ notice }) {
        if(!this.manifest)
            notice('No manifest was found.')
    }
}

module.exports = ExtensionModule;