const _ = require('lodash');
const { PromiseAllObject } = require('@/utils');
const EventEmitter = require('events');

class Model extends EventEmitter {
    id;
    isInvalid = false;
    logger;
    options = {};

    /**
     * @param {int|string} id
     * @param {Controller} controller
     * @returns {this}
     */
    constructor(id, controller, options = {}) {   
        super();    
        this.id = id;
        this.controller = controller;

        if(options) {
            this.options = options;

            if(options.enableLogger)
                this.logger = LOGGER.child({ label: this.toString() });
            
            if(typeof options.maxListeners == 'number') {
                this.setMaxListeners(options.maxListeners);
            }
        }
    }
    
    /**
     * Converts the model to a string.
     * @returns {string} A string representation of the model.
     */
    toString() {
        const type = this.constructor.name;
        const id = this.id || 'null';

        return `[${type} ${id}]`;
    }

    /**
     * Converts the model to JSON.
     * @returns {object} A JSON representation of the model.
     */
    toJSON() {
        return { id: this.id };
    }

    /**
     * Checks whether the model has any errors by calling this._validate().
     * @returns {boolean} Whether the model is valid or not.
     */
    checkValidity() {
        const _createMethod = (level) => {
            const isCritical = LOGGER.levels[level] === 0;

            return (message, meta) => {
                if(this.logger)
                    this.logger[level](message, meta);

                if(isCritical) 
                    this.isInvalid = true;
            }
        }

        const methods = _.mapValues(LOGGER.levels, (v, level) => _createMethod(level));

        this._validate(methods);

        return true;
    }
 
    /**
     * Checks whether the model has any errors (must be implemented by child).
     * @param {object} methods The methods that can be called.
     * @returns {string|void} An error message or nothing.
     */
    _validate() {
        throw new Error("Method '_validate()' is not implemented.");
    }

}

module.exports = Model;