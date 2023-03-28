const Model = require('@/models/Model');

class DeviceConnection extends Model {
    /** @type {boolean} */
    #isOpen = false;

    /** @type {Object} */
    options;

    /** @type {Array} */
    data = [];

    constructor(id, options) {
        super(id);
        this.options = options;
    }

    /**
     * Is invoked by this.device when data should be written to the connection. 
     * @param {string|Buffer|Object} - The data to write.
     */
    write(data) {
        throw new Error('Method write() is not implemented.');
    }

    /**
     * Is invoked by this.device for reading the data that was sent last.
     * @returns {Array} - The data that was sent.
     */
    read() {
        const data = this.data;
        this.data = [];
        return data;
    }

    /**
     * Should be invoked when a message is received through the conection.
     * @param {any} message - The message that was received.
     */
    handleData(message) {
        this.emit('data', message);
        this.data.push(message);
    }

    /**
     * Enables writing to the connection.
     */
    setOpened() {
        this.#isOpen = true;
        this.emit('open');
    }

    /**
     * Disables writing to the connection.
     */
    setClosed() {
        this.#isOpen = false;
        this.emit('close');
    }

    /**
     * Checks whether the connection is open.
     * @returns {boolean} - Whether the connection is open.
     */
    isOpen() {
        return this.#isOpen;
    }
}

module.exports = DeviceConnection;