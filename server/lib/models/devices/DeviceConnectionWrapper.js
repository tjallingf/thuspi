const ExtensionController = require('@/controllers/ExtensionController');
const EventEmitter = require('events');
const { DEVICE_CONNECTOR } = require('@/utils/extensions/blueprints/typeNames');

class DeviceConnectionWrapper extends EventEmitter {
    #connection;

    constructor(connection) {
        super();
        this.#connection = connection;
    }
    
    /**
     * Writes data to the connection.
     * @param {string} data
     */
    async write(data) {
        if(typeof this.#connection.write != 'function')
            throw new Error('Connection does not support writing.');
        
        if(!this.#connection.isOpen())
            throw new Error('Connection is not open.');

        this.#connection.write(data);
    }

    read() {
        if(typeof this.#connection.read != 'function')
            throw new Error('Connection does not support reading.');

        if(!this.#connection.isOpen())
            throw new Error('Connection is not open.');
        
        throw new Error('TODO: Implement support for reading.');
    }

    init() {
        return new Promise((resolve) => {

            connector.invoke('connect', [ this.config.options ]).then(connection => {
                this.#connection = connection;
                connection.open()
                return resolve();
            }).catch(err => {
                LOGGER.error(err);
            });
        })
    }

    isOpen() {
        return this.#connection.isOpen();
    }
}

module.exports = DeviceConnectionWrapper;