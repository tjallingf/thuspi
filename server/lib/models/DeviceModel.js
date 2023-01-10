const Model = require('@models/Model');
const ExtensionController = require('@controllers/ExtensionController');
const ConnectionController = require('@controllers/ConnectionController');
const ConnectionModel = require('@models/ConnectionModel');
const LogController = require('@controllers/LogController');
const ManifestManager = require('@managers/ManifestManager');
const _ = require('lodash');

class DeviceModel extends Model {
    driverItemId;
    driverExtension;
    driverManifest;

    searchEngineExt;
    searchEngineManifest;
    searchEngineModel;
    
    #conn;
    
    /**
     * Instantiates a new DeviceModel
     * @param {string} id 
     * @param {object} props
     * @returns {DeviceModel}
     */
    constructor(id, props, controller) {
        super(id, props, controller);

        const [ driverExtId, driverItemId ] = this.#splitType('driver');
        this.driverExt = ExtensionController.find(driverExtId);
        this.driverItemId = driverItemId;

        this.driverManifest = this.readDriverManifest();

        if(this.getProp('searchEngine.type')) {
            const [ searchEngineExtId, searchEngineItemId ] = this.#splitType('searchEngine');
            
            this.searchEngineExt = ExtensionController.find(searchEngineExtId); 
            this.searchEngineItemId = searchEngineItemId;

            this.searchEngineManifest = this.searchEngineExt.readItemManifest(`search_engines/${searchEngineItemId}`);
        }

        return this;
    }

    getCachedValue(input) {
        return this.getProp(`data.values.${input}`);
    }

    async readValue() {
        return new Promise((resolve, reject) => { 
            const args = [{
                device: this,
                options: this.getProp('driver.options') || {}
            }];

            this.driverExt.executeItem(`device_drivers/${this.driverItemId}/read_value`, args)
                .then(resolve)
                .catch(console.error);
        })
    }

    async writeValue(value) {
        return this.handleInput('main', value);
        // return new Promise((resolve, reject) => {
        //     if(this.driverManifest.isFalsy('writing.supported'))
        //         return reject(`Writing is not supported by ${this.toString()}.`);

        //     if(!this.validateValue(value))
        //         return reject(`Value is invalid for ${this.toString()}.`);

        //     const args = [{
        //         device: this,
        //         options: this.getProp('driver.options') || {},
        //         newValue: value
        //     }];

        //     this.driverExt.executeItem(`device_drivers/${this.driverItemId}/write_value`, args)
        //         .then(data => {                
        //             return resolve({ device: this, data })
        //         }).catch(reject);
        // })
    }

    async handleInput(name, value) {
        return new Promise(async (resolve, reject) => {
            if(this.driverManifest.isFalsy('writing.supported'))
                return reject(`Writing is not supported by ${this.toString()}.`);

            const parsedValue = await this.handleInput_getModifiedValue(name, value);
            const valueError = this.handleInput_validateValue(name, value);

            if(valueError instanceof Error)
                return reject(`Value is invalid for ${this.toString()}: ${valueError}`);

            const args = [{
                device: this,
                options: this.getProp('driver.options') || {},
                input: name,
                rawValue: value,
                value: parsedValue
            }];

            Log.debug(`Set value of input "${name.toUpperCase()}" of ${this.toString()} to "${value}".`);

            this.driverExt.executeItem(`device_drivers/${this.driverItemId}/handle_input`, args)
                .then(data => {           
                    this.setProp(`data.values.${name}`, value);
                    return resolve({ device: this, data })
                }).catch(reject);
        });
    }

    async handleInput_getModifiedValue(name, value) {
        return new Promise((resolve, reject) => {
            const input = this.findWritingInput(name);
        
            // Check if input type is search. Return if it is not.
            if(input?.type != 'search')
                return resolve(value);

            // Check if the search engine uses a result parser. Return if it does not.
            if(this.searchEngineManifest.isFalsy('enableResultValueModifier'))
                return resolve(value);

            const args = [{
                device: this,
                input: name,
                value: value
            }];

            this.searchEngineExt.executeItem(`search_engines/${this.searchEngineItemId}/modify_result_value`, args)
                .then(({ data }) => {
                    const modifiedValue = data;
                    return resolve(modifiedValue);
                })
        })
    }

    
    /**
     * Checks whether a given value is valid for this type of device
     * @param {*} value 
     * @returns 
     */
    handleInput_validateValue(name, value) {
        // Find input object for name
        const input = this.findWritingInput(name);
        if(!input?.type) return new Error(`Cannot find input with name "${name}".`);

        switch(input.type) {
            case 'switch':
                return (
                    typeof value === 'boolean') ? true :
                new Error('Value is not of type boolean.');
            case 'range':
                return (
                    typeof value === 'number' &&
                    value <= (input.min || value) &&
                    value >= (input.max || value) &&
                    value % (input.step || 1) === 0) ? true :
                new Error('Value is not of type number or does not follow the limitations.');
            case 'color':
                // TODO: add color check
                return true;
            case 'time':
                // TODO: add time check
                return true;
            case 'button':
                return true;
            case 'search':
                return true;
            default:
                return new Error(`Unsupported input type: "${input.type}".`);
        }
    }

    async handleSearch(keyword) {
        return new Promise((resolve, reject) => {
            const args = [{
                device: this,
                keyword: keyword,
                options: this.getProp('searchEngine.options') || {}
            }];

            this.searchEngineExt.executeItem(`search_engines/${this.searchEngineItemId}/handle_search`, args)
                .then(async ({ data }) => {
                    return resolve({ device: this, results: data });
                })
        })
    }

    /**
     * 
     * @param {string} name The name of the input to find.
     * @returns The input object in the manifest of the driver.
     */
    findWritingInput(name) {
        return _.find(this.driverManifest.get('writing.inputs'), ['name', name]);
    }

    /**
     * Returns the connection model of the device.
     * @returns {ConnectionModel|null}
     */
    getConnection() {
        // If the connection model has not yet been found, find it
        if(!(this.#conn instanceof ConnectionModel))
            this.#conn = this.#findConnectionModel();

        // Return connection model if it was found
        if(this.#conn instanceof ConnectionModel)
            return this.#conn;

        // Throw error if the connection model was not found
        throw Log.error(`Cannot find connection for ${this.toString()}.`);
    }

    /**
     * Sets a custom property of the device.
     * @param {string} keypath The keypath to set the value for.
     * @param {*} value The value to set.
     * @returns {DeviceModel} The DeviceModel.
     */
    setCustomProp(keypath, value) {
        this.setProp(`data.customProps.${keypath}`, value);
        return this;
    }
    
    /**
     * Gets a custom property of the device.
     * @param {string} keypath The keypath to get the value for.
     * @returns The value that was set for the given keypath.
     */
    getCustomProp(keypath) {
        return this.getProp(`data.customProps.${keypath}`);
    }

    readDriverManifest() {
        const data = this.driverExt.readItem(`device_drivers/${this.driverItemId}/manifest`);
        const manifest = new ManifestManager(data);
        
        // Run the 'dynamic_inputs' script if `manifest.dynamicInputs` is truthy
        if(manifest.isTruthy('writing.dynamicInputs')) {
            const dynamicInputsData = this.driverExt.readItem(`device_drivers/${this.driverItemId}/dynamic_inputs`, {
                allowScripts: true,
                scriptArgs: [{ device: this }]
            });
            
            manifest.mergeWith(_.pick(dynamicInputsData, ['writing.inputs', 'writing.displayInputs']));
        }

        return manifest;
    }
    
    /**
     * Finds the connection model corresponding to the device.
     * @returns {ConnectionModel|undefined}
     */
    #findConnectionModel() {
        return ConnectionController.find(this.getProp('connection.type'), this.getProp('connection.options'));
    }

    /**
     * 
     * @param {string} prop 
     * @returns {array} The type name split at every forward slash.
     */
    #splitType(prop) {
        return this.getProp(`${prop}.type`).split('/');
    }
}

module.exports = DeviceModel;