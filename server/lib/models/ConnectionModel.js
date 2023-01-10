const { EventEmitter } = require('events');

class ConnectionModel extends EventEmitter {
    options;
    device;
    #openState = false;

    constructor(options, device) {    
        super();

        this.options = options;
        this.device = device;
    }

    write() {
        return console.error(new Error('Method write() is not implemented.'));
    }

    read() {
        return console.error(new Error('Method read() is not implemented.'));
    }

    /**
     * Checks whether the connection is ready for reading and/or writing.
     * @returns {boolean} Whether the connection is ready.
     */
    isOpen() {
        return this.#openState;
    }
  
    /**
     * Should be called by the child instance when the connection is 
     * open for reading and/or writing.
     * @returns {ConnectionModel}
     */
    markAsOpened() {
        this.emit('open');
        this.#openState = true;

        return this;
    }

    /**
     * Should be called by the child instance when the connection is 
     * no longer open for reading and/or writing.
     * @returns {ConnectionModel}
     */
    markAsClosed() {
        this.emit('close');
        this.#openState = false;

        return this;
    }

    /**
     * Should be called by the child instance when a message is
     * received over the connection.
     * @param {*} message The message that was received.
     * @returns {ConnectionModel}
     */
    handleData(message) {
        this.emit('data', message);

        return this;
    }
}

module.exports = ConnectionModel;