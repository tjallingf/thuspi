const Model = require('@/models/Model');
const path = require('path');
const fs = require('fs');

class ExtensionAsset extends Model {
    /** @type {string} */
    filepath;

    /** @type {string} */
    dir;
    
    /** @type {any} */
    #contents;

    /**
     * 
     * @param {string} filepath - The filepath to the index.js file of the module.
     */
    constructor(filepath) {
        const filename = path.parse(filepath).name;

        // Converts 'storage/extensions/core/assets/language/en-us' to 'language/en-us'
        const id = path.relative(EXTENSIONS_DIR, filepath).split(path.sep).slice(2, -1).join('/')+'/'+filename;
        super(id);

        this.filepath = filepath;
        this.#contents = JSON.parse(fs.readFileSync(this.filepath));
    }

    getContents() {
        return this.#contents;
    }
}

module.exports = ExtensionAsset;