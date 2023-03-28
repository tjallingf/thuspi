const ExtensionFrameworkHelper = require('@/models/extensions/framework/ExtensionFrameworkHelper');
const blueprintTypes = require('@/utils/extensions/blueprints/types');
const ExtensionModule = require('@/models/extensions/ExtensionModule');
const path = require('path');

class ExtensionFramework {
    #helper;

    constructor() {
        this.#helper = new ExtensionFrameworkHelper();
    }

    lib = {
        /**
         * Requires a file from lib/ directory of the extension.
         */
        require: (id) => {
            const filepath = path.join(EXTENSIONS_DIR, this.#helper.extension.id, 'lib', id);
            return require(filepath);
        }
    }
    
    /**
     * @property {Function} register
     * @property {blueprintTypes} types
     */
    blueprint = {
        types: blueprintTypes,

        /**
         * Registers a blueprint.
         * @param {Object} blueprint - The class.
         */
        register: (blueprint) => {
            try {
                // Find the type that the blueprint uses
                const type = Object.values(blueprintTypes)
                    .find(type => blueprint.prototype instanceof type);

                // Throw an error if the blueprint class does not extend a valid type
                if(!type)
                    throw new Error('Blueprint must extend a module type.');

                const extModule = new ExtensionModule(this.#helper.filepath, blueprint, type);

                this.#helper.extension.registerModule(extModule);
            } catch(err) {
                console.error(err);
                LOGGER.error(`An error occured while registering ${blueprint.name}: ${err}`);
            }
    }

    }
}

module.exports = ExtensionFramework;